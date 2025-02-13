import Journey from "../models/JourneyModel.js";
import Asset from "../models/assetModel.js";
import Driver from "../models/driverModel.js";

export const createJourney = async (req, res) => {
  try {
    const { Journey_Type, vehicleNumber } = req.body;

    // Find the driver by vehicle number
    const driver = await Driver.findOne({ vehicleNumber });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Find the asset associated with the driver
    const asset = await Asset.findOne({ driver: driver._id }).populate("passengers");

    if (!asset) {
      return res.status(404).json({ message: "Asset not found for this driver" });
    }

    // Check if an active journey exists for this asset
    const existingJourney = await Journey.findOne({ Asset: asset._id });

    if (existingJourney && asset.isActive) {
      return res.status(400).json({ message: "A journey is already active for this vehicle. End the current journey before starting a new one." });
    }

    // Count the passengers in the asset
    const Occupancy = asset.passengers.length;

    // Create a new journey
    const newJourney = new Journey({
      Driver: driver._id,
      Asset: asset._id,
      Journey_Type,
      Occupancy,
    });

    await newJourney.save();

    // Update the Asset to set isActive to true
    asset.isActive = true;
    await asset.save(); // Save the updated asset

    return res.status(201).json({
      message: "Journey created successfully",
      newJourney,
      updatedAsset: asset, // Return the updated asset for confirmation
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};




export const getJourneys = async (req, res) => {
  try {
    // Fetch journeys and populate driver, asset, and passengers
    const journeys = await Journey.find()
      .populate({
        path: "Driver",
        model: "Driver",
      })
      .populate({
        path: "Asset",
        model: "Asset",
        populate: {
          path: "passengers",
          model: "Passenger",
        },
      });

    return res.status(200).json(journeys);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
