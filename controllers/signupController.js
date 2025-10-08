const express = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');

async function signUserUp(req, res){
    const { username,password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await pool.query('CALL create_user($1, $2)', [username, hashedPassword]);
        res.json({ message: 'User created' });
    } catch (err) {
        if (err.code === '23505') {
            res.status(409).json({ message: 'Username already taken' });
        } else {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = signUserUp