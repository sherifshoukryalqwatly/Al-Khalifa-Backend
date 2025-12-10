import express from "express";
import * as userController from '../../controllers/Users/user.controller.js';
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { createUserSchema , updateUserSchema } from '../../validations/Users/user.validation.js'
import { authorizeRole, isAuthenticated } from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.use(isAuthenticated);

router.route('/by_email/:email')
    .get(authorizeRole('SUPER_ADMIN','ADMIN'), userController.findByEmail)

router.route('/me')
    .get(userController.getMe);

router.route('/:id')
    .patch(validationMiddleware(updateUserSchema), userController.update)
    .delete(userController.remove)
    .get(authorizeRole('SUPER_ADMIN','ADMIN'),userController.findById);

router.route('/')
    .get(authorizeRole('SUPER_ADMIN','ADMIN'),userController.findAll)
    .post(authorizeRole('SUPER_ADMIN','ADMIN'),validationMiddleware(createUserSchema), userController.create)
    .delete(authorizeRole('SUPER_ADMIN','ADMIN'),userController.removeAll);


export default router;
