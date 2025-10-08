require('dotenv').config();
const express = require('express')
const app = express();
const signupRouter = require("./routes/signupRouter")
const loginRouter = require("./routes/loginRouter")
const dashboardRouter = require("./routes/dashboardRouter")
const tripRouter = require("./routes/tripRouter")
const expenseRouter = require("./routes/expenseRouter")
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/signup", signupRouter)
app.use("/login",loginRouter)
app.use("/dashboard",dashboardRouter)
app.use("/trips",tripRouter)
app.use("/expenses",expenseRouter)

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Hello, I am listening')
})