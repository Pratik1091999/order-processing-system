const ApiError = require("../utils/apiError"); // Adjust the path if needed

const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.statusCode || 500} - ${err.message}`);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }

    // Default error response for unhandled errors
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};

module.exports = errorHandler;
