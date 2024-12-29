const Vehicle = require("../models/vehicles");
const { generateVehicleId } = require("../models/sequence");

// Controller to create a vehicle record
exports.createVehicle = async (req, res) => {
  try {
    // Generate a unique vehicle ID
    const vehicleId = await generateVehicleId();
    const {
      customerName,
      phone,
      vehicleRegNo,
      brand,
      vehicleModel,
      mileage,
      vehicleAnalysis,
      services,
      spareParts,
      paymentMethod,
      paidAmount,
      discount,
    } = req.body;

    // Calculate vat and subTotal for each service
    const servicesWithDetails = services.map((service) => {
      const vat = service.vat !== undefined ? service.vat : 0.05 * (service.unitPrice * service.quantity); // User-defined or calculated VAT
      const subTotal = service.unitPrice * service.quantity + vat; // Subtotal includes overridden or calculated VAT
      return {
        ...service,
        vat,
        subTotal,
      };
    });
    // Calculate totalAmount and dueAmount
    const totalAmount = servicesWithDetails.reduce((total, service) => total + service.subTotal, 0);
    const dueAmount = totalAmount - discount;
    const pendingAmount = dueAmount - paidAmount;

    // Create a new Vehicle document
    const newVehicle = new Vehicle({
      vehicleId,
      customerName,
      phone,
      vehicleRegNo,
      brand,
      vehicleModel,
      mileage,
      vehicleAnalysis,
      services: servicesWithDetails,
      spareParts,
      paymentMethod,
      paidAmount,
      discount,
      totalAmount,
      dueAmount,
      pendingAmount,
    });

    // Save the document
    await newVehicle.save();
    res.status(201).json({
      message: "Vehicle record created successfully",
      data: newVehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating vehicle record",
      error: error.message,
    });
  }
};

// Read all vehicle records
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching vehicle records",
      error: error.message,
    });
  }
};

// Read single vehicle record
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicle record", error: error.message });
  }
};

// Update vehicle record
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Fetch the vehicle by ID
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Update fields from the request body
    if (updates.customerName) vehicle.customerName = updates.customerName;
    if (updates.phone) vehicle.phone = updates.phone;
    if (updates.vehicleRegNo) vehicle.vehicleRegNo = updates.vehicleRegNo;
    if (updates.brand) vehicle.brand = updates.brand;
    if (updates.vehicleModel) vehicle.vehicleModel = updates.vehicleModel;
    if (updates.mileage) vehicle.mileage = updates.mileage;
    if (updates.vehicleAnalysis) vehicle.vehicleAnalysis = updates.vehicleAnalysis;
    if (updates.spareParts) vehicle.spareParts = updates.spareParts;
    if (updates.paymentMethod) vehicle.paymentMethod = updates.paymentMethod;
    if (updates.paidAmount !== undefined) vehicle.paidAmount = updates.paidAmount;
    if (updates.discount !== undefined) vehicle.discount = updates.discount;

    // Update the services array and recalculate vat and subTotal for each service
    if (updates.services) {
      vehicle.services = updates.services.map((service) => {
        const vat = service.vat !== undefined ? service.vat : 0.05 * (service.unitPrice * service.quantity); // User-defined or calculated VAT
        const subTotal = service.unitPrice * service.quantity + vat; // Subtotal includes overridden or calculated VAT
        return {
          ...service,
          vat,
          subTotal,
        };
      });
    }

    // Recalculate totalAmount, dueAmount, and pendingAmount
    vehicle.totalAmount = vehicle.services.reduce((total, service) => total + service.subTotal, 0);
    vehicle.dueAmount = vehicle.totalAmount - vehicle.discount;
    vehicle.pendingAmount = vehicle.dueAmount - vehicle.paidAmount;

    // Update statusOfWork and finishDate based on pendingAmount
    if (vehicle.pendingAmount === 0 && vehicle.totalAmount > 0) {
      vehicle.statusOfWork = "DONE";
      vehicle.finishDate = new Date().toLocaleDateString();
    } else {
      vehicle.statusOfWork = "PROCESS";
      vehicle.finishDate = null;
    }

    // Save the updated vehicle
    const updatedVehicle = await vehicle.save();

    res.status(200).json({
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating vehicle",
      error: error.message,
    });
  }
};

// Delete vehicle record
exports.deleteVehicle = async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json({ message: "Vehicle record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle record", error: error.message });
  }
};

// Delete all vehicles
exports.deleteAllVehicles = async (req, res) => {
  try {
    const deleteAllVehicle = await Vehicle.deleteMany({});

    // Check if any vehicles were deleted
    if (deleteAllVehicle.deletedCount === 0) {
      return res.status(404).json({ message: "No vehicles found to delete" });
    }

    res.status(200).send("All vehicles deleted");
  } catch (err) {
    console.error(err); // It's a good practice to log the error for debugging purposes
    res.status(500).send("Error deleting vehicles");
  }
};
