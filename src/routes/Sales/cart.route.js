import express from "express";
import { cartController } from "../../controllers/Sales/cart.controller.js";
import { addItemSchema } from "../../validations/Sales/cart.validation.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import {isAuthenticated} from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", cartController.getCart);
router.post("/add", validationMiddleware(addItemSchema), cartController.addItem);
router.delete("/:productId", cartController.removeItem);
router.delete("/", cartController.clear);

export default router;
