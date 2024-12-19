const express = require("express");
const router = express.Router();
const partorderController = require("../CRUDfiles/partordersCRUD");

router.post("/part-orders", partorderController.createPartOrder);
router.get("/part-orders", partorderController.getAllSpareParts);
router.get("/part-orders/:id", partorderController.getSparePartById);
router.put("/part-orders/:id", partorderController.updateSparePartOrder);
router.delete("/part-orders/:id", partorderController.deleteSparePartOrder);

module.exports = router;
