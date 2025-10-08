const { Router } = require("express");
const { getExpense, getItems, deleteExpense } = require('../controllers/expenseController')
const authenticateToken = require('../controllers/authenticateToken')

const expenseRouter = Router();

expenseRouter.get("/getExpense",authenticateToken,getExpense);
expenseRouter.get("/getItems",authenticateToken,getItems);
expenseRouter.post("/deleteExpense",authenticateToken,deleteExpense);

module.exports = expenseRouter;