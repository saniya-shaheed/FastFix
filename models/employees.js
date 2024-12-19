const mongoose = require("mongoose");

// Define the Service schema
const WorkSchema = new mongoose.Schema({
  department: { type: String },
  designation: { type: String },
  salary: { type: Number },
  startDate: { type: Date },
  contractEndDate: { type: Date },
});

const passportSchema = new mongoose.Schema({
  passportNo: { type: String },
  expiryPassport: { type: Date },
});

const emiratesidSchema = new mongoose.Schema({
  emiratesidNo: { type: String },
  expiryID: { type: Date },
});

// Define the Vehicle schema
const EmployeeSchema = new mongoose.Schema({
  name: { type: String },
  dateOfBirth: { type: Date },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  nationality: { type: String },
  status: { type: String },
  visaExpiry: { type: Date },
  work: WorkSchema,
  passport: passportSchema,
  emiratesId: emiratesidSchema,
});

module.exports = mongoose.model("Employees", EmployeeSchema);
