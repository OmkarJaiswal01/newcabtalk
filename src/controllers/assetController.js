
import Driver from "../models/driverModel.js";
import Passenger from "../models/Passenger.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
// import Asset from "../models/AssetModel.js";

export const addAsset = asyncHandler(async (req, res) => {
  const { driverId, capacity, isActive } = req.body;

  if (!driverId || !capacity) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Driver ID and capacity are required.",
      });
  }

  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res
      .status(404)
      .json({ success: false, message: "Driver not found." });
  }

  // const asset = await Asset.create({
  //   driver: driver._id,
  //   capacity,
  //   passengers: [],
  //   isActive,
  // });

  res.status(201).json({
    success: true,
    message: "Asset added successfully.",
    asset,
  });
});

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

export const addPassengerToAsset = asyncHandler(async (req, res) => {
  const { passengerId } = req.body;
  const { id: assetId } = req.params;

  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res.status(404).json({ success: false, message: "Asset not found." });}

  const passenger = await Passenger.findById(passengerId);
  if (!passenger) {
    return res.status(404).json({ success: false, message: "Passenger not found." });  }

  if (passenger.asset) {
    return res.status(400).json({ success: false, message: "Passenger already assigned to another asset." });  }

  if (asset.passengers.includes(passengerId)) {
    return res.status(400).json({ success: false, message: "Passenger already assigned to this asset." });  }

  if (asset.passengers.length >= asset.capacity) {
    return res.status(400).json({ success: false, message: "Asset capacity full. Cannot add more passengers." });  }

  asset.passengers.push(passengerId);
  await asset.save();

  passenger.asset = assetId;
  await passenger.save();

  res.status(200).json({ success: true, message: "Passenger added to asset successfully.", asset }); });

export const removePassengerFromAsset = asyncHandler(async (req, res) => {
  const { passengerId } = req.body;
  const { id: assetId } = req.params;

  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res.status(404).json({ success: false, message: "Asset not found." });}

  const passenger = await Passenger.findById(passengerId);
  if (!passenger) {
    return res.status(404).json({ success: false, message: "Passenger not found." });
  }
  asset.passengers = asset.passengers.filter( (p) => p.toString() !== passengerId );
  await asset.save();

  passenger.asset = null;
  await passenger.save();

  res.status(200).json({
    success: true,
    message: "Passenger removed from asset successfully.",
    asset,
  });
});

export const updateAsset = asyncHandler(async (req, res) => {
  const { capacity, isActive } = req.body;
  const { id: assetId } = req.params;

  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res
      .status(404)
      .json({ success: false, message: "Asset not found." });
  }

  if (capacity !== undefined) asset.capacity = capacity;
  if (isActive !== undefined) asset.isActive = isActive;

  await asset.save();

  res.status(200).json({
    success: true,
    message: "Asset updated successfully.",
    asset,
  });
});

export const deleteAsset = asyncHandler(async (req, res) => {
  const { id: assetId } = req.params;

  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res
      .status(404)
      .json({ success: false, message: "Asset not found." });
  }

  await asset.deleteOne();

  res.status(200).json({
    success: true,
    message: "Asset deleted successfully.",
  });
});
