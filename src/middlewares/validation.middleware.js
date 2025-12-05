
import AppErrors from "../utils/ApiError.js";
import { StatusCodes } from "../utils/constants.js";

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
        const errorDetails = error.details.map(d => d.message);
        throw AppErrors.createError(errorDetails, StatusCodes.BAD_REQUEST, "Validation Error");
      }

      next();
    };
};

export { validate };