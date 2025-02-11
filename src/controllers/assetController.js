import { asyncHandler } from "../middlewares/asyncHandler.js";
import Driver from "../models/driverModel.js";
import Asset from "../models/AssetModel.js";

/**
 * Create a new asset.
 * The asset must be linked to a driver via driverId.
 */
export const createAsset = asyncHandler(async (req, res) => {
  const { driverId, capacity, isActive } = req.body;

  if (!driverId || !capacity) {
    return res.status(400).json({
      success: false,
      message: "Driver ID and capacity are required.",
    });
  }

  // Ensure the driver exists.
  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({
      success: false,
      message: "Driver not found.",
    });
  }

  // Create the asset.
  const asset = await Asset.create({
    driver: driver._id,
    capacity,
    isActive: isActive || false,
    passengers: [],
  });

  res.status(201).json({
    success: true,
    message: "Asset created successfully.",
    asset,
  });
});

/**
 * Get all assets with populated driver (and passenger) information.
 */
export const getAllAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find()
    .populate("driver", "name phoneNumber vehicleNumber licenseImage")
    .populate("passengers", "Employee_ID Employee_Name Employee_PhoneNumber");

  if (!assets || assets.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No assets found.",
    });
  }

  res.status(200).json({
    success: true,
    assets,
  });
});
