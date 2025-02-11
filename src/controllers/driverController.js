// driverController.js
import asyncHandler from "express-async-handler";
import Driver from "../models/driverModel.js";

/**
 * Create or update a driver.
 * If a driver with the same phoneNumber exists, update it.
 */
export const createDriver = asyncHandler(async (req, res) => {
  const { name, phoneNumber, vehicleNumber, licenseImage } = req.body;

  if (!name || !phoneNumber || !vehicleNumber || !licenseImage) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, phoneNumber, vehicleNumber, licenseImage) are required.",
    });
  }

  // Check if the driver exists (using phoneNumber as unique identifier)
  let driver = await Driver.findOne({ phoneNumber });
  if (driver) {
    // Update driver details.
    driver.name = name;
    driver.vehicleNumber = vehicleNumber;
    driver.licenseImage = licenseImage;
    await driver.save();

    return res.status(200).json({
      success: true,
      message: "Driver updated successfully.",
      driver,
    });
  }

  // Create a new driver.
  driver = await Driver.create({ name, phoneNumber, vehicleNumber, licenseImage });
  return res.status(201).json({
    success: true,
    message: "Driver created successfully.",
    driver,
  });
});

/**
 * Get all drivers.
 */
export const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find();

  if (!drivers || drivers.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No drivers found.",
    });
  }

  res.status(200).json({
    success: true,
    drivers,
  });
});
