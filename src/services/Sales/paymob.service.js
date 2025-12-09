import axios from 'axios';
import { PAYMOB_BASE, INTEGRATION_ID } from '../../config/paymob.config.js';


export const authToken = async () => {
    const res = await axios.post(`${PAYMOB_BASE}/auth/tokens`, { api_key: process.env.PAYMOB_API_KEY });
    return res.data.token;
};


export const createOrder = async (authToken, amountCents, items = []) => {
    const res = await axios.post(`${PAYMOB_BASE}/ecommerce/orders`, { auth_token: authToken, amount_cents: amountCents, currency: 'EGP', items });
    return res.data;
};


export const generatePaymentKey = async (authToken, amountCents, orderId, billingData) => {
    const res = await axios.post(`${PAYMOB_BASE}/acceptance/payment_keys`, {
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: billingData,
        currency: 'EGP',
        integration_id: INTEGRATION_ID,
    });
        return res.data.token;
};


export const getOrder = async (orderId) => {
    const res = await axios.get(`${PAYMOB_BASE}/ecommerce/orders/${orderId}`);
    return res.data;
};