import express from "express";
import {
  addAsset,
  getAllAssets,
  addPassengerToAsset,
  removePassengerFromAsset,
  updateAsset,
  deleteAsset,
} from "../controllers/assetController.js";
 
const router = express.Router();
 
router.post("/add", addAsset);
router.get("/all", getAllAssets);
router.post("/:id/add-passenger", addPassengerToAsset);
router.post("/:id/remove-passenger", removePassengerFromAsset);
router.post("/:id", updateAsset);
router.delete("/:id", deleteAsset);
 
export default router;
 
 