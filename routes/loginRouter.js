const { Router } = require("express");
const logUserIn = require('../controllers/loginController')

const loginRouter = Router();

loginRouter.post("/", logUserIn);

module.exports = loginRouter;