import logger from "../config/logger.config.js";

export const requestLogger = (req,res,next)=> {
    logger.info(`${req.method} ${req.originalUrl}`);
    next()
}