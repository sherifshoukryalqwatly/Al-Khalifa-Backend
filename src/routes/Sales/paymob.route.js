import express from 'express';
import { paymobCreatePaymentController, paymobWebhookController } from '../../controllers/Sales/paymob.controller.js';
import { paymentRepo } from '../../repo/Sales/paymob.repo.js';
import { verifyPaymobWebhook } from '../../middlewares/verifyPaymobHmac.middleware.js';


export const mountPaymobRoutes = (app, db) => {
const router = express.Router();


router.post('/create', paymobCreatePaymentController(db, paymentRepo));
router.post('/webhook', verifyPaymobWebhook(), paymobWebhookController(db, paymentRepo));


app.use('/api/paymob', router);
};