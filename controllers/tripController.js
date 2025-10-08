const express = require('express');
const pool = require('../db');
const { GoogleGenAI } = require('@google/genai');

async function getTrip(req, res){
    const{trip_id} = req.query
    balances = await pool.query('SELECT * FROM get_trip_balances($1)', [trip_id]);
    expenses = await pool.query('SELECT * FROM get_trip_expenses($1)', [trip_id]);
    res.json({
        balances: balances.rows,
        expenses: expenses.rows
    })
}

async function addUsers(req, res){
    const { trip_id,added_users } = req.body;
    result = await pool.query(`CALL public.add_users_to_trip($1,$2)`, [trip_id, added_users]);
    res.json({message: "Users added!"})
}

async function getAllUsers(req, res){
    const{trip_id} = req.query
    result = await pool.query(`SELECT * FROM select_relevant_users($1)`, [trip_id]);
    res.json(result.rows)
}

async function addExpense(req, res){
    const creator_id = req.user.user_id;
    const {isEquallySelected, isMultipleSelected, expenseName, totalAmount, userByAmounts,
        selectedByUsers, trip_id, usernameToIdMap} = req.body
    
    function convertToUserIdAmounts(usernameAmounts, usernameToIdMap) {
        var converted = {};
        for (const username in usernameAmounts){
            const user_id = usernameToIdMap[username]
            converted[user_id] = parseFloat(usernameAmounts[username])
        }
        return converted;
    }

    function convertToUserId(usernames, usernameToIdMap) {
        var converted = [];
        for (username of usernames){
            const user_id = usernameToIdMap[username]
            converted.push(user_id)
        }
        return converted;
    }

    if (selectedByUsers.length===1){
        target = selectedByUsers[0]
        userByAmounts[target] = totalAmount
    }

    const userByAmountsConverted = convertToUserIdAmounts(userByAmounts, usernameToIdMap);
    const selectedByUserIds = convertToUserId(selectedByUsers, usernameToIdMap)

    if(!isMultipleSelected){
        const {userForAmounts, selectedForUsers } = req.body
        const userForAmountsConverted = convertToUserIdAmounts(userForAmounts, usernameToIdMap);
        const selectedForUserIds = convertToUserId(selectedForUsers, usernameToIdMap)
        
        if(isEquallySelected){
            const item_list = {
                items: [
                    {
                    name: expenseName,
                    amount: totalAmount,
                    paid_by: userByAmountsConverted,
                    paid_for: selectedForUserIds,
                    }
                ]
            };
            converted_item_list = JSON.stringify(item_list)
            result = await pool.query(`CALL add_expense_to_trip($1,$2,$3,$4,$5,$6,$7::jsonb)`, 
                [trip_id,creator_id,expenseName,parseFloat(totalAmount),isMultipleSelected,isEquallySelected,converted_item_list]);
            res.json({message: "Expense added!"})
            return
        }
        else{
            var item_list = {items:[]}
            for (const item in userForAmountsConverted){
                item_amount = userForAmountsConverted[item]
                item_percentage = item_amount / totalAmount

                const paid_by = {};
                for (const payerId in userByAmountsConverted) {
                    const originalAmount = parseFloat(userByAmountsConverted[payerId]);
                    paid_by[payerId] = parseFloat((originalAmount * item_percentage).toFixed(5));
                }

                item_list['items'].push({
                    name: expenseName,
                    amount: item_amount,
                    paid_by: paid_by,
                    paid_for: [item],
                })
            }
        }

    }

    if (isMultipleSelected){
        const { items } = req.body
        var item_list = {items:[]}
            for (const item of items){
                item_amount = item['amount']
                item_percentage = item_amount / totalAmount

                const paid_by = {};
                for (const payerId in userByAmountsConverted) {
                    const originalAmount = parseFloat(userByAmountsConverted[payerId]);
                    paid_by[payerId] = parseFloat((originalAmount * item_percentage).toFixed(5));
                }
                
                const selectedForUserIds = convertToUserId(item['selectedFor'], usernameToIdMap)

                item_list['items'].push({
                    name: item['name'],
                    amount: item_amount,
                    paid_by: paid_by,
                    paid_for: selectedForUserIds,
                })       
        }
    }

    converted_item_list = JSON.stringify(item_list)
    console.log(converted_item_list)
    result = await pool.query(`CALL add_expense_to_trip($1,$2,$3,$4,$5,$6,$7::jsonb)`, 
    [trip_id,creator_id,expenseName,parseFloat(totalAmount),isMultipleSelected,isEquallySelected,converted_item_list]);
    res.json({message: "Expense added!"})
}

const genAI = new GoogleGenAI({apiKey: process.env.GOOGLE_AI_API_KEY})

async function parseReceipt(req, res){
    const {data} = req.body
    const prompt = `
            You are a receipt parser. 
            Extract structured data from raw OCR text of receipts. 
            Always respond with valid JSON only, no explanations.

            Use this exact format:

            {
                "expense": string,               // name of the restaurant or shop
                "date": string | null,              // date/time if present, otherwise null
                "items": [
                { "name": string, "price": number }
                ],
                "subtotal": number | null           // total before taxes applied, otherwise null
                "total": number | null              // final total amount, otherwise null
            }

            Rules:
            - Normalize restaurant names to clean text (strip extra OCR noise).
            - Dates should be ISO-like if possible (YYYY-MM-DD HH:mm), otherwise null.
            - Extract all line items with their prices. If price is missing, skip the item.
            - Always extract the total price after taxes.
            - If a field cannot be found, set it to null.
            - If there are 2 of the same item, place then as two separate items in the item list

            OCR: ${data.text}`
    const resp = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    const raw = resp.text;
    res.json({processed_data: raw})
}

module.exports = { getTrip, addUsers, getAllUsers, addExpense, parseReceipt } 