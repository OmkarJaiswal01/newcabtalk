import mongoose from "mongoose";
import Asset from "../models/assetModel.js";
import Driver from "../models/driverModel.js";
import Passenger from "../models/Passenger.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
 
/**
 * Create or update an asset.
 * If an asset already exists for the given driver, update its capacity (if valid) and other fields.
 */
export const addAsset = asyncHandler(async (req, res) => {
  const { driverId, capacity, isActive } = req.body;
 
  // Validate driverId
  if (!driverId || !mongoose.Types.ObjectId.isValid(driverId)) {
    return res.status(400).json({
      success: false,
      message: "Valid Driver ID is required.",
    });
  }
 
  // Validate capacity
  if (
    capacity === undefined ||
    capacity === null ||
    isNaN(capacity) ||
    capacity <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Capacity must be a positive number.",
    });
  }
 
  // Validate isActive if provided
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isActive must be a boolean value.",
    });
  }
 
  // Check if driver exists
  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({
      success: false,
      message: "Driver not found.",
    });
  }
 
  // Check if an asset already exists for this driver
  let asset = await Asset.findOne({ driver: driverId });
  if (asset) {
    // Ensure new capacity is not less than the number of assigned passengers
    if (asset.passengers.length > capacity) {
      return res.status(400).json({
        success: false,
        message:
          "New capacity cannot be less than the number of assigned passengers.",
      });
    }
    asset.capacity = capacity;
    if (isActive !== undefined) asset.isActive = isActive;
    await asset.save();
    return res.status(200).json({
      success: true,
      message:
        "Asset already exists for this driver. Updated asset capacity successfully.",
      asset,
    });
  }
 
  // Create new asset if it doesn't exist
  asset = await Asset.create({
    driver: driver._id,
    capacity,
    passengers: [],
    isActive: isActive === true,
  });
 
  res.status(201).json({
    success: true,
    message: "Asset added successfully.",
    asset,
  });
});
 
/**
 * Retrieve all assets with populated driver and passenger details.
 */
export const getAllAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find()
    .populate("driver", "name vehicleNumber")
    .populate("passengers", "Employee_ID Employee_Name Employee_PhoneNumber");
 
  res.status(200).json({
    success: true,
    message: "Assets retrieved successfully.",
    assets,
  });
});
 
/**
 * Add a passenger to an asset.
 * This operation uses a transaction to update both the asset and the passenger atomically.
 */
export const addPassengerToAsset = asyncHandler(async (req, res) => {
  const { passengerId } = req.body;
  const { id: assetId } = req.params;
 
  // Validate assetId
  if (!assetId || !mongoose.Types.ObjectId.isValid(assetId)) {
    return res.status(400).json({
      success: false,
      message: "Valid Asset ID is required in URL parameters.",
    });
  }
 
  // Validate passengerId
  if (!passengerId || !mongoose.Types.ObjectId.isValid(passengerId)) {
    return res.status(400).json({
      success: false,
      message: "Valid Passenger ID is required in request body.",
    });
  }
 
  // Check if asset exists
  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res.status(404).json({ success: false, message: "Asset not found." });
  }
 
  // Check if passenger exists
  const passenger = await Passenger.findById(passengerId);
  if (!passenger) {
    return res
      .status(404)
      .json({ success: false, message: "Passenger not found." });
  }
 
  // Check if passenger is already assigned to an asset
  if (passenger.asset) {
    return res.status(400).json({
      success: false,
      message: "Passenger is already assigned to an asset.",
    });
  }
 
  // Check if passenger is already in the asset's passenger list
  if (asset.passengers.some((p) => p.toString() === passengerId)) {
    return res.status(400).json({
      success: false,
      message: "Passenger is already assigned to this asset.",
    });
  }
 
  // Check if asset capacity is full
  if (asset.passengers.length >= asset.capacity) {
    return res.status(400).json({
      success: false,
      message: "Asset capacity full. Cannot add more passengers.",
    });
  }
 
  // Use a transaction for atomic updates
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
 
    // Add passenger to asset
    asset.passengers.push(passengerId);
    await asset.save({ session });
 
    // Update passenger's asset reference
    passenger.asset = asset._id;
    await passenger.save({ session });
 
    await session.commitTransaction();
    session.endSession();
 
    return res.status(200).json({
      success: true,
      message: "Passenger added to asset successfully.",
      asset,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Error adding passenger to asset.",
      error: error.message,
    });
  }
});
 
/**
 * Remove a passenger from an asset.
 * This operation uses a transaction to update both the asset and the passenger atomically.
 */
export const removePassengerFromAsset = asyncHandler(async (req, res) => {
  const { passengerId } = req.body;
  const { id: assetId } = req.params;
 
  // Validate assetId
  if (!assetId || !mongoose.Types.ObjectId.isValid(assetId)) {
    return res.status(400).json({
      success: false,
      message: "Valid Asset ID is required in URL parameters.",
    });
  }
 
  // Validate passengerId
  if (!passengerId || !mongoose.Types.ObjectId.isValid(passengerId)) {
    return res.status(400).json({
      success: false,
      message: "Valid Passenger ID is required in request body.",
    });
  }
 
  // Check if asset exists
  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res.status(404).json({
      success: false,
      message: "Asset not found.",
    });
  }
 
  // Check if passenger exists
  const passenger = await Passenger.findById(passengerId);
  if (!passenger) {
    return res.status(404).json({
      success: false,
      message: "Passenger not found.",
    });
  }
 
  // Ensure the passenger is actually assigned to this asset
  if (!asset.passengers.some((p) => p.toString() === passengerId)) {
    return res.status(400).json({
      success: false,
      message: "Passenger is not assigned to this asset.",
    });
  }
 
  // Use a transaction for atomic updates
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
 
    // Remove passenger from asset
    asset.passengers = asset.passengers.filter(
      (p) => p.toString() !== passengerId
    );
    await asset.save({ session });
 
    // Update passenger's asset reference if it matches this asset
    if (passenger.asset && passenger.asset.toString() === assetId) {
      passenger.asset = null;
      await passenger.save({ session });
    }
 
    await session.commitTransaction();
    session.endSession();
 
    return res.status(200).json({
      success: true,
      message: "Passenger removed from asset successfully.",
      asset,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Error removing passenger from asset.",
      error: error.message,
    });
  }
});
 
/**
 * Update an asset’s capacity and/or active status.
 * Validates that new capacity is not less than the number of already assigned passengers.
 */
export const updateAsset = asyncHandler(async (req, res) => {
  const { capacity, isActive } = req.body;
  const { id: assetId } = req.params;
 
  // Validate assetId
  if (!assetId || !mongoose.Types.ObjectId.isValid(assetId)) {
    return res.status(400).json({
      success: false,
      message: "Valid Asset ID is required in URL parameters.",
    });
  }
 
  // Find asset
  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res.status(404).json({
      success: false,
      message: "Asset not found.",
    });
  }
 
  // Update capacity if provided
  if (capacity !== undefined) {
    if (isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a positive number.",
      });
    }
    // Ensure new capacity is not less than the number of assigned passengers
    if (asset.passengers.length > capacity) {
      return res.status(400).json({
        success: false,
        message:
          "New capacity cannot be less than the number of assigned passengers.",
      });
    }
    asset.capacity = capacity;
  }
 
  // Update isActive if provided
  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value.",
      });
    }
    asset.isActive = isActive;
  }
 
  await asset.save();
  return res.status(200).json({
    success: true,
    message: "Asset updated successfully.",
    asset,
  });
});
 
/**
 * Delete an asset.
 * Uses a transaction to remove the asset and clear the asset reference from all associated passengers.
 */
export const deleteAsset = asyncHandler(async (req, res) => {
  const { id: assetId } = req.params;
 
  // Validate assetId
  if (!assetId || !mongoose.Types.ObjectId.isValid(assetId)) {
    return res.status(400).json({
      success: false,
      message: "Valid Asset ID is required in URL parameters.",
    });
  }
 
  // Find asset
  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res.status(404).json({
      success: false,
      message: "Asset not found.",
    });
  }
 
  // Use a transaction to delete asset and update associated passengers
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
 
    // Clear asset references from passengers assigned to this asset
    await Passenger.updateMany(
      { asset: assetId },
      { $set: { asset: null } },
      { session }
    );
 
    // Delete the asset
    await asset.deleteOne({ session });
 
    await session.commitTransaction();
    session.endSession();
 
    return res.status(200).json({
      success: true,
      message: "Asset deleted successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: "Error deleting asset.",
      error: error.message,
    });
  }
});
 
 