import Passenger from '../models/Passenger.js';
export const insertPassenger = async (req, res) => {
 
    const { Employee_ID, Employee_Name, Employee_PhoneNumber, Employee_ShiftTiming, Employee_Address,Service } = req.body;
 
    try {
        const newPassenger = new Passenger({
            Employee_ID,
            Employee_Name,
            Employee_PhoneNumber,
            Employee_ShiftTiming,
            Employee_Address,
            Service
        });
 
        await newPassenger.save();
        res.status(201).json(newPassenger);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPassengers = async (req, res) => {
    try {
        const passengers = await Passenger.find();
        res.status(200).json(passengers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};