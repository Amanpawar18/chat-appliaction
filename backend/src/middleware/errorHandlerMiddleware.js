import ApiError from "../utils/ApiError.js";

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let response = {
    status: "error",
    message: err.message || "Something went wrong !!",
    success: false,
    code: err.code || "SERVER_ERROR",
  };

  // If the error is an instance of ApiError, use its custom properties
  if (err instanceof ApiError) {
    response.status = "error";
    response.message = err.message;
    response.code = err.code || "API_ERROR";
    response.errors = err.errors || [];
    res.status(err.statusCode).json(response);
  } else {
    // For other types of errors, handle them generically
    console.error(err.stack); // Log the full error for debugging
    res.status(500).json(response); // Default to 500 Internal Server Error
  }
  return res
};

export default errorHandler;
