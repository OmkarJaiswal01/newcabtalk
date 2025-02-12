import express from 'express';

import { endJourney,  getEndedJourneys } from '../controllers/completeJourneyController.js';
 
const completeJourneyRoutes = express.Router();
 
// Middleware to parse JSON bodies
completeJourneyRoutes.use(express.json());
 
// Route for inserting a passenger
completeJourneyRoutes.post('/endJourneys', endJourney);
completeJourneyRoutes.get('/endJourneys',getEndedJourneys )
 
export default completeJourneyRoutes;