import mongoose from "mongoose";
import Journey from "../models/JourneyModel.js";
import Asset from "../models/AssetModel.js"; // ✅ Ensure Asset model is imported

// ✅ Create Journey with proper ObjectId conversion
export const createJourney = async (req, res) => {
  try {
    const { Assets, Journey_Type, Occupancy, SOS_Status } = req.body;

    // Validate Assets as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(Assets)) {
      return res.status(400).json({ message: "Invalid Assets ID." });
    }

    // Check if Asset exists
    const assetExists = await Asset.findById(Assets);
    if (!assetExists) {
      return res.status(404).json({ message: "Asset not found." });
    }

    if (!Assets || !Journey_Type || !Occupancy) {
      return res.status(400).json({ message: "All required fields (Assets, Journey_Type, Occupancy) must be provided." });
    }

    const newJourney = new Journey({
      Assets: new mongoose.Types.ObjectId(Assets), // ✅ Ensure it's saved as ObjectId
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

// ✅ Get all Journeys with populated Asset details
export const getJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find()
      .populate('Assets');

    if (!journeys.length) {
      return res.status(404).json({ message: "No journeys found." });
    }

    res.status(200).json(journeys);
  } catch (error) {
    res.status(500).json({ message: "Error fetching journeys", error: error.message });
  }
};
