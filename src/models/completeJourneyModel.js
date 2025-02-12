import mongoose from "mongoose";

const endJourneySchema = new mongoose.Schema(
  {
    Driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    Asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    Journey_Type: { type: String, required: true },
    Occupancy: { type: Number, required: true },
    endedAt: { type: Date, default: Date.now }, // Store end time
  },
  { timestamps: true }
);

export default mongoose.model("EndJourneyModel", endJourneySchema);
