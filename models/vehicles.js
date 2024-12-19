const mongoose = require("mongoose");

// Define the Service schema
const ServiceSchema = new mongoose.Schema({
  serviceType: { type: String },
  amount: { type: Number },
  quantity: { type: Number },
  totalPrice: { type: Number }, // Calculated total for each service (amount * quantity)
});

// Define the Vehicle schema
const VehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, unique: true, required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleRegNo: { type: String },
  brand: { type: String },
  vehicleModel: { type: String },
  mileage: { type: Number },
  vehicleAnalysis: { type: String },
  services: [ServiceSchema],
  spareParts: { type: String },
  paymentMethod: { type: String },
  paidAmount: { type: Number },
  date: { type: Date, default: Date.now },
  totalAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  statusOfWork: { type: String, default: "PROCESS" },
  finishDate: { type: Date, default: null },
});

// Pre-save hook to calculate `totalAmount`, `pendingAmount`, and update `statusOfWork`
VehicleSchema.pre("save", async function (next) {
  const vehicle = this;

  // Ensure `totalPrice` is calculated for each service
  vehicle.services.forEach((service) => {
    if (!service.totalPrice) {
      service.totalPrice = service.amount * service.quantity;
    }
  });

  // Calculate `totalAmount` and `pendingAmount`
  vehicle.totalAmount = vehicle.services.reduce(
    (total, service) => total + service.totalPrice,
    0
  );
  vehicle.pendingAmount = vehicle.totalAmount - vehicle.paidAmount;

  // Update status and finish date if work is done
  if (vehicle.pendingAmount === 0 && vehicle.totalAmount > 0) {
    vehicle.statusOfWork = "DONE";
    vehicle.finishDate = new Date().toLocaleDateString();
  }

  next();
});

// Create and export the Vehicle model
module.exports = mongoose.model("Vehicle", VehicleSchema);
