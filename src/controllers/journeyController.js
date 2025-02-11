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
  const { Journey_Type, Occupancy, vehicleNumber, SOS_Status } = req.body;

  if (!Journey_Type || !Occupancy || !vehicleNumber) {
    return res.status(400).json({
      success: false,
      message: "Journey_Type, Occupancy, and vehicleNumber are required.",
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
  const assets = await AssetModel.find({ driver: driver._id });
  if (!assets || assets.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No assets found for this driver.",
    });
  }
  const assetIds = assets.map((asset) => asset._id);

  // 3. Create the journey with the asset IDs.
  const journey = await Journey.create({
    Assets: assetIds,
    Journey_Type,
    Occupancy,
    SOS_Status: SOS_Status || "inActive",
  });

  res.status(201).json({
    success: true,
    message: "Journey created successfully.",
    journey,
  });
});


/**
 * Get all journeys.
 * Each journey is populated with its asset details and the associated driver details.
 */
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
