const express = require('express');
const pool = require('../db');


async function getExpense(req, res){
    const {expense_id} = req.query
    result = await pool.query('SELECT * FROM expenses WHERE expenses.expense_id = ($1)', [expense_id]);
    res.json({expense: result.rows})
}

async function getItems(req,res){
    const {expense_id} = req.query
    result = await pool.query('SELECT * FROM items WHERE items.expense_id = ($1)', [expense_id]);
    res.json({item: result.rows})
}

async function deleteExpense(req,res){
    const {expense_id, trip_id} = req.body
    result - await pool.query(`CALL delete_expense_to_trip($1,$2)`, [expense_id, trip_id])
    res.json({message: "Trip deleted"})
}

module.exports = { getExpense, getItems, deleteExpense } 