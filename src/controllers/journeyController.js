// journeyController.js
import asyncHandler from "express-async-handler";
import Journey from "../models/journeyModel.js";
import Driver from "../models/driverModel.js";
import AssetModel from "../models/AssetModel.js";

/**
 * Create a journey based on a given vehicle number.
 * The client must provide Journey_Type, Occupancy, and vehicleNumber.
 */
export const createJourneyByVehicleNumber = asyncHandler(async (req, res) => {
  const { Journey_Type, vehicleNumber, SOS_Status } = req.body;

  // Validate required fields.
  if (!Journey_Type || !vehicleNumber) {
    return res.status(400).json({
      success: false,
      message: "Journey_Type and vehicleNumber are required.",
    });
  }

  // 1. Find the driver using the vehicle number.
  const driver = await Driver.findOne({ vehicleNumber });
  if (!driver) {
    return res.status(404).json({
      success: false,
      message: "Driver not found for the given vehicle number.",
    });
  }

  // 2. Retrieve asset(s) associated with this driver.
  // Ensure that the "passengers" field is selected if it's not included by default.
  const assets = await AssetModel.find({ driver: driver._id }).select('capacity passengers');
  if (!assets || assets.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No assets found for this driver.",
    });
  }
  
  const assetIds = assets.map((asset) => asset._id);

  // 3. Calculate occupancy as the total number of passengers across all assets.
  const occupancy = assets.reduce((total, asset) => {
    const passengersCount = asset.passengers ? asset.passengers.length : 0;
    return total + passengersCount;
  }, 0);

  // 4. Create the journey with the computed occupancy and asset IDs.
  const journey = await Journey.create({
    Assets: assetIds,
    Journey_Type,
    Occupancy: occupancy,
    SOS_Status: SOS_Status || "inActive",
  });

  res.status(201).json({
    success: true,
    message: "Journey created successfully.",
    journey,
  });
});





export const getAllJourneys = asyncHandler(async (req, res) => {
  const journeys = await Journey.find()
    .populate({
      path: "Assets",
      populate: { path: "driver", select: "name phoneNumber vehicleNumber licenseImage" },
    });

  if (!journeys || journeys.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No journeys found.",
    });
  }

  res.status(200).json({
    success: true,
    journeys,
  });
});
