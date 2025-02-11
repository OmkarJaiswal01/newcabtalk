import express from 'express';
import { getPassengers, insertPassenger } from '../controllers/PassengersController.js';
import { createJourney, getJourneys } from '../controllers/journeyController.js';
 
const journeyRoutes = express.Router();
 
// Middleware to parse JSON bodies
journeyRoutes.use(express.json());
 
// Route for inserting a passenger
journeyRoutes.post('/journey', createJourney);
journeyRoutes.get('/journey', getJourneys)
 
export default journeyRoutes;