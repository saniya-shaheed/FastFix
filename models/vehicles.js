const mongoose = require("mongoose");

// Define the Service schema
const ServiceSchema = new mongoose.Schema({
  serviceType: { type: String },
  unitPrice: { type: Number }, // Renamed from 'amount'
  quantity: { type: Number },
  vat: { type: Number, default: 0 }, // New field
  subTotal: { type: Number }, // Renamed from 'totalPrice' and updated calculation
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
  totalAmount: { type: Number, default: 0 }, // Sum of subtotals
  discount: { type: Number, default: 0 }, // New field
  dueAmount: { type: Number, default: 0 }, // New field
  pendingAmount: { type: Number, default: 0 },
  statusOfWork: { type: String, default: "PROCESS" },
  finishDate: { type: Date, default: null },
});

// Pre-save hook to calculate `subTotal`, `vat`, `totalAmount`, `dueAmount`, and `pendingAmount`
VehicleSchema.pre("save", async function (next) {
  const vehicle = this;

  // Ensure `subTotal` and `vat` are calculated for each service
  vehicle.services.forEach((service) => {
    const serviceTotal = service.unitPrice * service.quantity;

    // Check if the user has overridden the VAT
    if (service.vat === undefined || service.vat === null) {
      // Calculate VAT if it's not set by the user
      service.vat = (5 / 100) * serviceTotal;
    }

    // Calculate Subtotal based on VAT
    service.subTotal = serviceTotal + (service.vat || 0); // Use 0 if VAT is explicitly set to 0
  });

  // Calculate `totalAmount` as the sum of all `subTotal`
  vehicle.totalAmount = vehicle.services.reduce(
    (total, service) => total + service.subTotal,
    0
  );

  // Calculate `dueAmount` and `pendingAmount`
  vehicle.dueAmount = vehicle.totalAmount - vehicle.discount;
  vehicle.pendingAmount = vehicle.dueAmount - vehicle.paidAmount;

  // Update status and finish date if work is done
  if (vehicle.pendingAmount === 0 && vehicle.totalAmount > 0) {
    vehicle.statusOfWork = "DONE";
    vehicle.finishDate = new Date(); // Use Date object directly
  } else {
    vehicle.statusOfWork = "PROCESS"; // Reset status if not done
    vehicle.finishDate = null; // Clear finish date if not done
  }

  next();
});


// Create and export the Vehicle model
module.exports = mongoose.model("Vehicle", VehicleSchema);
