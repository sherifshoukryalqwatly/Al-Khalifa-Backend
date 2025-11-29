import express from 'express';
import cors from 'cors';
import passport from 'passport';

import routes from './routes/index.js';
import { errorHandler } from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { swaggerSetup } from "./config/swagger.config.js";
import passportConfig from "./config/passport.config.js";

const app = express();

// Security Middlewares
app.use(cors());
app.use(express.json());

// Logger
app.use(requestLogger);

// Passport
// passportConfig(passport);
// app.use(passport.initialize());

// Routes
app.use("/api", routes);

// Swagger Docs
swaggerSetup(app);

// Error Handler
app.use(errorHandler);

export default app;