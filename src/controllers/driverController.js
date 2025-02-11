import Driver from "../models/driverModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const addDriver = asyncHandler(async (req, res, next) => {
  const { name, phoneNumber, vehicleNumber, licenseImage } = req.body;
  console.log({ name, phoneNumber, vehicleNumber, licenseImage }, "Request body received");

  if (!name || !phoneNumber || !vehicleNumber || !licenseImage) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, phoneNumber, vehicleNumber, licenseImage) are required.",
    });
  }

  try {
    let driver = await Driver.findOne({ phoneNumber });

    if (driver) {
      driver.name = name;
      driver.vehicleNumber = vehicleNumber;
      driver.licenseImage = licenseImage;
      await driver.save();

      return res.status(200).json({
        success: true,
        message: "Driver details updated successfully.",
        driver,
      });
    }

    driver = await Driver.create({
      name,
      phoneNumber,
      vehicleNumber,
      licenseImage,
    });

    return res.status(201).json({
      success: true,
      message: "Driver added successfully.",
      driver,
    });
  } catch (error) {
    console.error("Error in adding/updating driver:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
});

export const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find();

  if (drivers.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No drivers found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Drivers retrieved successfully.",
    drivers,
  });
});
