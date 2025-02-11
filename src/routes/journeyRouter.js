import express from 'express';

import { createJourneyByVehicleNumber, getAllJourneys,  } from '../controllers/journeyController.js';
 
const journeyRoutes = express.Router();
 
// Middleware to parse JSON bodies
journeyRoutes.use(express.json());
 
// Route for inserting a passenger
journeyRoutes.post('/journeys/byVehicle', createJourneyByVehicleNumber);
journeyRoutes.get('/journeys', getAllJourneys)
 
export default journeyRoutes;