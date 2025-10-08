const express = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = 'JWT_SECRET=9ac!sUqv3#mv$s90F423l$xyQ'


async function logUserIn(req, res){
    const { username,password } = req.body;
    console.log(username)
    try {
        result = await pool.query('SELECT * FROM login_user($1)', [username]);
        user = result.rows[0]

        if (user == undefined){
            return res.status(404).json({ message: "User not found!"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch){
            return res.status(401).json({ message: "Wrong Password!"});
        }

        const token = jwt.sign(
            { username: user.username, user_id: user.id },
            SECRET
        )
        
        res.json({ message: "Login request successful", token});

    } catch (err){
        console.log(err)
        res.status(500).json({message: 'server error'})
    }
}

module.exports = logUserIn 