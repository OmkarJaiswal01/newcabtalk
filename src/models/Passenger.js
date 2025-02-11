import mongoose from "mongoose";
const PassengerSchema = new mongoose.Schema(
  {
    Employee_ID: { type: String, required: true, unique: true },
    Employee_Name: { type: String, required: true },
    Employee_PhoneNumber: { type: String, required: true },
    Employee_ShiftTiming: { type: String, required: true },
    Employee_Address: { type: String, required: true },
    Service: { type: String, required: true },
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", default: null },
  },
  { timestamps: true }
);
export default mongoose.model("Passenger", PassengerSchema);