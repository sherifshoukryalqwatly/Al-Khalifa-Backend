import express from "express";

import { authJWT } from "../../middlewares/passport.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";


const router = express.Router();

// router.post("/image", authJWT, upload.single("image"));

export default router;