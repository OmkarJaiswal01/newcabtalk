import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    capacity: { type: Number, required: true },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Passenger" }],
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite error
const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);

export default Asset;
