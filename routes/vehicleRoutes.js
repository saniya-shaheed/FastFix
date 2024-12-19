const express = require("express");
const router = express.Router();
const vehicleController = require("../CRUDfiles/vehiclesCRUD");

router.post("/vehicles", vehicleController.createVehicle);
router.get("/vehicles", vehicleController.getAllVehicles);
router.get("/vehicles/:id", vehicleController.getVehicleById);
router.put("/vehicles/:id", vehicleController.updateVehicle);
router.delete("/vehicles/:id", vehicleController.deleteVehicle);
router.delete(
  "/delete/delete-all-vehicles",
  vehicleController.deleteAllVehicles
);

module.exports = router;
