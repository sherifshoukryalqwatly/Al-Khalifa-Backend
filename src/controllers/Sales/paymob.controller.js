import { authToken, createOrder, generatePaymentKey } from '../../services/Sales/paymob.service.js';
import { buildIframeUrl } from '../../utils/paymob.js';
import { createPaymentSchema } from '../../validations/Sales/paymob.validation.js';


export const paymobCreatePaymentController = (db, repo) => async (req, res) => {
    try {
        const { error, value } = createPaymentSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });


        const amountCents = Math.round(value.amount * 100);


        const token = await authToken();
        const order = await createOrder(token, amountCents, value.items);


        const billingData = {
            email: value.user.email,
            first_name: value.user.name,
            last_name: '',
            phone_number: value.user.phone || '',
            city: 'Cairo',
            country: 'EG',
        };


        const paymentKey = await generatePaymentKey(token, amountCents, order.id, billingData);


        if (repo && db) {
            await repo.createPaymentRecord(db, { orderId: order.id, amountCents, userId: value.user.id, status: 'PENDING' });
        }


        return res.json({ iframeUrl: buildIframeUrl(paymentKey), orderId: order.id });
    } catch (err) {
        console.error('createPayment error', err);
        return res.status(500).json({ message: 'Internal error' });
    }
};


export const paymobWebhookController = (db, repo) => async (req, res) => {
    try {
        const payload = req.body;
        const orderObj = payload.obj || payload.payload || payload.data || {};
        const orderId = orderObj.order?.id || orderObj.id || orderObj.order_id;
        const success = orderObj.success || orderObj.is_success || orderObj.transaction?.success;


        if (!orderId) return res.status(400).end();


        if (success && repo && db) {
            await repo.updatePaymentStatus(db, orderId, 'PAID', { webhook: payload });
            console.log('Payment succeeded for', orderId);
        } else if (repo && db) {
            await repo.updatePaymentStatus(db, orderId, 'FAILED', { webhook: payload });
            console.log('Payment failed for', orderId);
        }


        return res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.error('webhook handler error', err);
        return res.status(500).end();
    }
};