import express from "express";
import { createDriver, getAllDrivers } from "../controllers/driverController.js";

const router = express.Router();

router.post("/add", createDriver);
router.get("/all", getAllDrivers); // Route to fetch all drivers

export default router;
