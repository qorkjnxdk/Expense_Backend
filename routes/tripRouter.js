const { Router } = require("express");
const {getTrip, addUsers, getAllUsers, addExpense, parseReceipt} = require('../controllers/tripController')
const authenticateToken = require('../controllers/authenticateToken')

const tripRouter = Router();

tripRouter.get("/getTrip",authenticateToken,getTrip);
tripRouter.post("/addUsers",authenticateToken,addUsers);
tripRouter.get("/getAllUsers",authenticateToken,getAllUsers);
tripRouter.post("/addExpense",authenticateToken,addExpense);
tripRouter.post("/parseReceipt",authenticateToken,parseReceipt);

module.exports = tripRouter;