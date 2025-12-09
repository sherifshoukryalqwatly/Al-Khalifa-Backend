import crypto from 'crypto';
import { IFRAME_ID, HMAC_SECRET } from '../../config/paymob.config.js';


export const buildIframeUrl = (paymentToken) => {
    return `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`;
};


export const verifyHmac = (payloadRaw, receivedHash, secret = HMAC_SECRET) => {
    const hmac = crypto.createHmac('sha512', secret);
    hmac.update(payloadRaw);
    return hmac.digest('hex') === receivedHash;
};