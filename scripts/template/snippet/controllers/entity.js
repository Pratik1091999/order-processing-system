const logger = require("../../../utils/logger");
const ApiResponse = require("../../../utils/apiResponse");
const ApiError = require("../../../utils/apiError");
const asyncHandler = require("../../../utils/asyncHandler");
const EntityModel = require("../../../models/entityNameLower");
const ErrorMessage = require("../../../utils/errorMessage");

// Create a new Entity
const createEntity = asyncHandler(async (req, res) => {
    try {
        const entityNameLowerData = new EntityModel(req.body);
        logger.info(`[Entity Controller] createEntity() entityNameLowerData: ${JSON.stringify(entityNameLowerData)}`);

        const savedEntity = await entityNameLowerData.save();
        logger.info(`[Entity Controller] createEntity() savedEntity: ${JSON.stringify(savedEntity)}`);

        return res.status(201).json(new ApiResponse(201,ErrorMessage.entityNameLower.create_success ,savedEntity));
    } catch (error) {
        logger.error(`[Entity Controller] createEntity() Error creating Entity: ${error.message}`);
        throw new ApiError(500, ErrorMessage.entityNameLower.create_failed);
    }
});

// Get all Entitys
const getAllEntitys = asyncHandler(async (req, res) => {
    try {
        const Entitys = await EntityModel.find();
        logger.info(`[Entity Controller] getAllEntitys() Fetched ${Entitys.length} Entitys`);

        return res.status(200).json(new ApiResponse(200, ErrorMessage.entityNameLower.fetch_all_success ,Entitys));
    } catch (error) {
        logger.error(`[Entity Controller] getAllEntitys() Error fetching Entitys: ${error.message}`);
        throw new ApiError(500, ErrorMessage.entityNameLower.fetch_all_failed);
    }
});

// Get Entity by ID
const getEntityById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const entity = await EntityModel.findById(id);
        
        if (!entity) {
            throw new ApiError(404, ErrorMessage.entityNameLower.not_found);
        }
        
        logger.info(`[Entity Controller] getEntityById() Fetched entity: ${JSON.stringify(entity)}`);
        return res.status(200).json(new ApiResponse(200, ErrorMessage.user.fetch_single_success ,entity,));
    } catch (error) {
        logger.error(`[Entity Controller] getEntityById() Error fetching entity: ${error.message}`);
        throw new ApiError(500, ErrorMessage.entityNameLower.fetch_single_failed);
    }
});

// Update Entity by ID (PUT)
const updateEntity = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEntity = await EntityModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedEntity) {
            throw new ApiError(404, ErrorMessage.entityNameLower.not_found);
        }

        logger.info(`[Entity Controller] updateEntity() Updated entity: ${JSON.stringify(updatedEntity)}`);
        return res.status(200).json(new ApiResponse(200, ErrorMessage.entityNameLower.update_success ,updatedEntity));
    } catch (error) {
        logger.error(`[Entity Controller] updateEntity() Error updating entity: ${error.message}`);
        throw new ApiError(500, ErrorMessage.entityNameLower.update_failed);
    }
});

// Partially Update Entity by ID (PATCH)
const partialUpdateEntity = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEntity = await EntityModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedEntity) {
            throw new ApiError(404, ErrorMessage.entityNameLower.not_found);
        }

        logger.info(`[Entity Controller] partialUpdateEntity() Partially updated entity: ${JSON.stringify(updatedEntity)}`);
        return res.status(200).json(new ApiResponse(200, ErrorMessage.entityNameLower.update_success ,updatedEntity));
    } catch (error) {
        logger.error(`[Entity Controller] partialUpdateEntity() Error partially updating entity: ${error.message}`);
        throw new ApiError(500, ErrorMessage.entityNameLower.update_failed);
    }
});

// Delete Entity by ID
const deleteEntity = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntity = await EntityModel.findByIdAndDelete(id);

        if (!deletedEntity) {
            throw new ApiError(404, ErrorMessage.entityNameLower.not_found);
        }

        logger.info(`[Entity Controller] deleteEntity() Deleted entity: ${JSON.stringify(deletedEntity)}`);
        return res.status(200).json(new ApiResponse(200, ErrorMessage.entityNameLower.delete_success ,deletedEntity));
    } catch (error) {
        logger.error(`[Entity Controller] deleteEntity() Error deleting entity: ${error.message}`);
        throw new ApiError(500, ErrorMessage.entityNameLower.delete_failed);
    }
});

module.exports = {
    createEntity,
    getAllEntitys,
    getEntityById,
    updateEntity,
    partialUpdateEntity,
    deleteEntity
};
