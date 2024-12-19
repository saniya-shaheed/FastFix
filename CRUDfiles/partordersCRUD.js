const OrdersOfParts = require("../models/partorders");

exports.createPartOrder = async (req, res) => {
  try {
    const { parts, supplier, phone, targetVehicle } = req.body;

    const partsWithTotalPrice = parts.map((sparePart) => ({
      ...sparePart,
      totalPrice: sparePart.amount * sparePart.quantity,
    }));

    const newSparePartsOrder = new OrdersOfParts({
      parts: partsWithTotalPrice,
      supplier,
      phone,
      targetVehicle,
    });

    // Save the document
    await newSparePartsOrder.save();
    res.status(201).json({
      message: " record created successfully",
      data: newSparePartsOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating  record",
      error: error.message,
    });
  }
};

exports.getAllSpareParts = async (req, res) => {
  try {
    const allSpareParts = await OrdersOfParts.find();
    res.status(200).json(allSpareParts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching  records", error: error.message });
  }
};

exports.getSparePartById = async (req, res) => {
  try {
    const sparePart = await OrdersOfParts.findById(req.params.id);
    if (!sparePart)
      return res.status(404).json({ message: "record not found" });
    res.status(200).json(sparePart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching  record", error: error.message });
  }
};

exports.updateSparePartOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Fetch the spare part order by ID
    const sparePartToUpdate = await OrdersOfParts.findById(id);

    if (!sparePartToUpdate) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Update individual fields from the request body if provided
    if (updates.supplier) sparePartToUpdate.supplier = updates.supplier;
    if (updates.phone) sparePartToUpdate.phone = updates.phone;
    if (updates.targetVehicle)
      sparePartToUpdate.targetVehicle = updates.targetVehicle;

    // Validate and update the parts array, and recalculate totalPrice for each part
    if (Array.isArray(updates.parts)) {
      sparePartToUpdate.parts = updates.parts.map((part) => ({
        ...part,
        totalPrice: part.amount * part.quantity, // Recalculate totalPrice
      }));
    } else if (updates.parts) {
      return res
        .status(400)
        .json({ message: "Invalid 'parts' data. It must be an array." });
    }

    // Recalculate totalAmount
    sparePartToUpdate.totalAmount = sparePartToUpdate.parts.reduce(
      (total, part) => total + part.totalPrice,
      0
    );

    // Save the updated spare part order
    const updatedSparePart = await sparePartToUpdate.save();

    res.status(200).json({
      message: "Record updated successfully",
      data: updatedSparePart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating record",
      error: error.message,
    });
  }
};

exports.deleteSparePartOrder = async (req, res) => {
  try {
    const deletedSparePartOrder = await OrdersOfParts.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSparePartOrder)
      return res.status(404).json({ message: "record not found" });
    res.status(200).json({ message: " record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting  record", error: error.message });
  }
};
