const { Router } = require("express");
const signUserUp = require('../controllers/signupController')

const signupRouter = Router();

signupRouter.post("/",signUserUp);

module.exports = signupRouter;