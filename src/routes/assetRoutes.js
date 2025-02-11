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
router.put("/:id/add-passenger", addPassengerToAsset);
router.put("/:id/remove-passenger", removePassengerFromAsset);
router.put("/:id", updateAsset);
router.delete("/:id", deleteAsset);

export default router;
