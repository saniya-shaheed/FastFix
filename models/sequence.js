const mongoose = require("mongoose");

// Define the Sequence schema
const SequenceSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true }, // The year (e.g., 2024)
  sequence: { type: Number, default: 0 }, // Current sequence number for the year
});

// Create the Sequence model
const Sequence = mongoose.model("Sequence", SequenceSchema);

// Function to generate a unique vehicle ID
const generateVehicleId = async () => {
  const currentYear = new Date().getFullYear();

  // Find and update the sequence for the current year
  const sequenceDoc = await Sequence.findOneAndUpdate(
    { year: currentYear },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true } // Create a new document if it doesn't exist
  );

  // Pad the sequence with leading zeros to ensure it's 4 digits
  const sequenceNumber = sequenceDoc.sequence.toString().padStart(4, "0");

  // Combine the year and sequence number to form the vehicleId
  return `${currentYear}${sequenceNumber}`;
};

// Export the model and function
module.exports = {
  Sequence,
  generateVehicleId,
};
