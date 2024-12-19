const express = require("express");
const router = express.Router();
const employeesController = require("../CRUDfiles/employeeCRUD");

router.post("/employees", employeesController.createEmployee);
router.get("/employees", employeesController.getEmployees);
router.get("/employees/:id", employeesController.getEmployeeById);
router.put("/employees/:id", employeesController.updateEmployee);
router.delete("/employees/:id", employeesController.deleteEmployee);

module.exports = router;
