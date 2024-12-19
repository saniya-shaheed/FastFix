const Employee = require("../models/employees");

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    res.status(201).json({ message: "Employee created", data: savedEmployee });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Read all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching employee record",
        error: error.message,
      });
  }
};

// Update an employee
const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) throw new Error("Employee not found");
    res.status(200).json({ message: "updated", data: updatedEmployee });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) throw new Error("Employee not found");
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
