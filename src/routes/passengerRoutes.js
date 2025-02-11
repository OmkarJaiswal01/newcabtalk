import express from 'express';
import { getPassengers, insertPassenger } from '../controllers/PassengersController.js';
 
const passengerRoutes = express.Router();
 
// Middleware to parse JSON bodies
passengerRoutes.use(express.json());
 
// Route for inserting a passenger
passengerRoutes.post('/Passenger', insertPassenger);
passengerRoutes.get('/passenger', getPassengers)
 
export default passengerRoutes;