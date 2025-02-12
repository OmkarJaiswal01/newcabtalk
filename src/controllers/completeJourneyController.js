
import Journey from "../models/JourneyModel.js"; // Active Journey Model
import EndJourney from "../models/completeJourneyModel.js"; // Ended Journey Model
import Asset from "../models/assetModel.js";
import Driver from "../models/driverModel.js";

export const endJourney = async (req, res) => {
  try {
    const { vehicleNumber } = req.body;

    // Find driver by vehicle number
    const driver = await Driver.findOne({ vehicleNumber });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Find the active journey
    const journey = await Journey.findOne({ Driver: driver._id });

    if (!journey) {
      return res.status(404).json({ message: "No active journey found for this vehicle" });
    }

    // Move the journey data to EndJourney
    const endedJourney = new EndJourney({
      Driver: journey.Driver,
      Asset: journey.Asset,
      Journey_Type: journey.Journey_Type,
      Occupancy: journey.Occupancy,
    });

    await endedJourney.save();

    // Delete the active journey
    await Journey.deleteOne({ _id: journey._id });

    // Update Asset status to inactive
    await Asset.updateOne({ _id: journey.Asset }, { isActive: false });

    return res.status(200).json({
      message: "Journey ended successfully",
      endedJourney,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getEndedJourneys = async (req, res) => {
    try {
      const endedJourneys = await EndJourney.find()
        .populate({
          path: "Driver",
          select: "vehicleNumber", // Fetch only vehicleNumber
        })
        .select("Journey_Type Occupancy"); // Fetch required fields
  
      const formattedData = endedJourneys.map((journey) => ({
        vehicleNumber: journey.Driver.vehicleNumber,
        Journey_Type: journey.Journey_Type,
        Occupancy: journey.Occupancy,
      }));
  
      return res.status(200).json(formattedData);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  