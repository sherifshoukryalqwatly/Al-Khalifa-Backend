import getRawBody from 'raw-body';
import { verifyHmac, HMAC_SECRET } from '../../utils/paymob.js';


export const verifyPaymobWebhook = () => async (req, res, next) => {
    try {
        const raw = await getRawBody(req);
        const rawString = raw.toString('utf8');
        const receivedHash = req.headers['x-paymob-hmac'] || req.headers['x-hmac-signature'] || req.query.hmac || '';


        if (!verifyHmac(rawString, receivedHash, HMAC_SECRET)) {
            return res.status(401).json({ message: 'Invalid webhook signature' });
        }


        req.rawBody = rawString;
        req.body = JSON.parse(rawString);
        next();
    } catch (err) {
        console.error('Webhook middleware error', err);
        return res.status(400).json({ message: 'Invalid webhook' });
    }
};