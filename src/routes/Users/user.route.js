import express from "express";
import * as userController from '../../controllers/Users/user.controller.js';
import validationMiddleware,{ createUserSchema , updateUserSchema } from '../../validations/Users/user.validation.js'
const router = express.Router();

router.get('/by_email/:email', userController.findByEmail);

router.route('/:id')
    .patch(validationMiddleware(updateUserSchema), userController.update)
    .delete(userController.remove)
    .get(userController.findById);

router.route('/')
    .get(userController.findAll)
    .post(validationMiddleware(createUserSchema), userController.create)
    .delete(userController.removeAll);


export default router;
