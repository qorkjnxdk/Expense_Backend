const { Router } = require("express");
const {getAllTrips, createTrips, getAllUsers, deleteTrip} = require('../controllers/dashboardController')
const authenticateToken = require('../controllers/authenticateToken')

const dashboardRouter = Router();

dashboardRouter.get("/getAllUsers",authenticateToken,getAllUsers);
dashboardRouter.post("/createTrip",authenticateToken,createTrips);
dashboardRouter.get("/getAllTrips",authenticateToken,getAllTrips);
dashboardRouter.post("/deleteTrip",authenticateToken,deleteTrip);

module.exports = dashboardRouter;