const express = require('express');
const pool = require('../db');


async function getAllTrips(req, res){
    const user_id = req.user.user_id;
    result = await pool.query('SELECT * FROM get_all_trips($1)', [user_id]);
    res.json({
        username: req.user.username,
        trips: result.rows
    })
}

async function getAllUsers(req, res){
    const user = req.user.username;
    result = await pool.query(`SELECT username, id FROM users WHERE username != $1`, [user]);
    res.json(result.rows)
}

async function deleteTrip(req, res){
    const { trip_id }  = req.body
    result = await pool.query(`CALL delete_trip($1)`, [trip_id]);
    res.json({message: "Trip deleted"})
}

async function createTrips(req, res){
    const { trip_name,added_users } = req.body;
    added_users.push(req.user.user_id)
    result = await pool.query('SELECT create_trip_with_users($1, $2, $3)',
        [trip_name, req.user.user_id, added_users]);
    res.json({ message: 'Trip created' });}

module.exports = { getAllTrips, getAllUsers, createTrips,deleteTrip} 