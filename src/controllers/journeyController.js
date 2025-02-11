import mongoose from "mongoose";
import Journey from "../models/JourneyModel.js";
import Asset from "../models/AssetModel.js";

export const createJourney = async (req, res) => {
  try {
    const { Journey_Type, Occupancy, Assets, SOS_Status } = req.body;

    if (!Journey_Type || !Occupancy || !Assets) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newJourney = new Journey({
      Assets,
      Journey_Type,
      Occupancy,
      SOS_Status: SOS_Status || "inActive",
    });

    const savedJourney = await newJourney.save();
    res.status(201).json(savedJourney);
  } catch (error) {
    res.status(500).json({ message: "Error creating journey", error: error.message });
  }
};



export const getJourneys = async (req, res) => {
  try {
      const journeys = await Journey.find().populate('Assets');
      res.status(200).json(journeys);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching journeys', error: error.message });
  }
};


export const getJourneyById = async (req, res) => {
  try {
      const { id } = req.params;
      const journey = await Journey.findById(id).populate('Assets');

      if (!journey) {
          return res.status(404).json({ message: 'Journey not found.' });
      }

      res.status(200).json(journey);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching journey', error: error.message });
  }
};

// ✅ Update Journey
export const updateJourney = async (req, res) => {
  try {
      const { id } = req.params;
      const { Journey_Type, Occupancy, Vehicle_Number, Assets, SOS_Status } = req.body;

      const updatedJourney = await Journey.findByIdAndUpdate(
          id,
          { Journey_Type, Occupancy, Vehicle_Number, Assets, SOS_Status },
          { new: true }
      );

      if (!updatedJourney) {
          return res.status(404).json({ message: 'Journey not found.' });
      }

      res.status(200).json(updatedJourney);
  } catch (error) {
      res.status(500).json({ message: 'Error updating journey', error: error.message });
  }
};

// ✅ Delete Journey
export const deleteJourney = async (req, res) => {
  try {
      const { id } = req.params;
      const deletedJourney = await Journey.findByIdAndDelete(id);

      if (!deletedJourney) {
          return res.status(404).json({ message: 'Journey not found.' });
      }

      res.status(200).json({ message: 'Journey deleted successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting journey', error: error.message });
  }
};
