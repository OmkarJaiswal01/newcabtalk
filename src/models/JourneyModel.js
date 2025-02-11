import mongoose from "mongoose";

const journeySchema = new mongoose.Schema({
  Assets: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset",
    required: true,
  },
  Journey_Type: {
    type: String,
    required: true,
  },
  Occupancy: {
    type: Number,
    required: true,
  },
  SOS_Status: {
    type: String,
    default: "inActive",
  },
});

// ✅ Prevent model overwrite error
const Journey = mongoose.models.Journey || mongoose.model("Journey", journeySchema);

export default Journey;
