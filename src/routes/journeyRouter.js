import express from 'express';

import { createJourney, getJourneys,  } from '../controllers/journeyController.js';
 
const journeyRoutes = express.Router();
 
// Middleware to parse JSON bodies
journeyRoutes.use(express.json());
 
// Route for inserting a passenger
journeyRoutes.post('/journeys', createJourney);
journeyRoutes.get('/journeys', getJourneys)
 
export default journeyRoutes;