const logger = require("../../../utils/logger");
const ApiResponse = require("../../../utils/apiResponse");
const ApiError = require("../../../utils/apiError");
const asyncHandler = require("../../../utils/asyncHandler");
const UserModel = require("../../../models/user");
const ErrorMessage = require("../../../utils/errorMessage");
const { generateToken ,verifyToken } = require("../../../utils/common_function");

// register a new User
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, "User already exists"));
    }

    // Create new user
    const newUser = new UserModel({ name, email, password });
    await newUser.save();
    logger.info(`[User Controller] registerUser() userData: ${JSON.stringify(newUser)}`);

    return res.status(201).json(new ApiResponse(201, ErrorMessage.user.create_success, null));
  } catch (error) {
    logger.error(`[User Controller] registerUser() Error creating User: ${error.message}`);
    throw new ApiError(500, ErrorMessage.user.create_failed);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      logger.warn(`[User Controller] loginUser() Failed login attempt - User not found: ${email}`);
      return next(new ApiError(404, "User not found"));
    }

    // Compare password using the model method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ApiError(401, "Invalid credentials"));
    }

    // Generate tokens
    const accessToken = generateToken(user.id, process.env.JWT_SECRET, process.env.JWT_EXPIRES);
    const refreshToken = generateToken(user.id, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRES);

    user.refreshToken = refreshToken;
    await user.save();

    logger.info(`[User Controller] loginUser() user: ${JSON.stringify(user)}`);
    return res.status(200).json(new ApiResponse(200, "Login successful", { accessToken, refreshToken }));
  } catch (error) {
    logger.error(`[User Controller] loginUser() Error login User: ${error}`);
    throw new ApiError(500, ErrorMessage.user.fetch_single_failed);
  }
});

const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return next(new ApiError(403, "Invalid or expired refresh token"));
    }

    // Find user by ID
    const user = await UserModel.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return next(new ApiError(403, "Refresh token is invalid or revoked"));
    }

    // Generate new tokens
    const accessToken = generateToken(user.id, process.env.JWT_SECRET, process.env.JWT_EXPIRES);
    const newRefreshToken = generateToken(user.id, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRES);

    // Update user's refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();
    logger.info(`[Auth Controller] refreshToken() user: ${JSON.stringify(user)}`);
    return res
      .status(200)
      .json(new ApiResponse(200, "Token refreshed successfully", { accessToken, refreshToken: newRefreshToken }));
  } catch (error) {
    logger.error(`[Auth Controller] refreshToken() Error refreshing token: ${error.message}`);
    return next(new ApiError(500, "Failed to refresh token"));
  }
});

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
};
