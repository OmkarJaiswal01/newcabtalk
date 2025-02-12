import mongoose from "mongoose";
const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    licenseImage: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.model("Driver", driverSchema);
 