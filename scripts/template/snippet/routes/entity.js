const express = require("express");
const router = express.Router();
const {
    createEntity,
    getAllEntitys,
    getEntityById,
    updateEntity,
    partialUpdateEntity,
    deleteEntity
} = require("../../../controllers/api/v1/entityNameLower");

// Create a new Entity
router.post("/", createEntity);

// Get all Entitys
router.get("/", getAllEntitys);

// Get Entity by ID
router.get("/:id", getEntityById);

// Update Entity by ID
router.put("/:id", updateEntity);

// Partially update Entity by ID
router.patch("/:id", partialUpdateEntity);

// Delete Entity by ID
router.delete("/:id", deleteEntity);

module.exports = router;
