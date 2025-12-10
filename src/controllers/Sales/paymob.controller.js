import { authToken, createOrder, generatePaymentKey } from '../../services/Sales/paymob.service.js';
import { buildIframeUrl } from '../../utils/paymob.js';
import { createPaymentSchema } from '../../validations/Sales/paymob.validation.js';
import { auditLogService } from '../../services/System/auditlog.service.js';

// Helper to log audit actions
const logAction = async ({ user, action, targetModel, targetId, description, req }) => {
  await auditLogService.createLog({
    user: user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req?.ip || null,
    userAgent: req?.headers?.['user-agent'] || null
  });
};

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
      const paymentRecord = await repo.createPaymentRecord(db, {
        orderId: order.id,
        amountCents,
        userId: value.user.id,
        status: 'PENDING'
      });

      // Audit log for payment creation
      await logAction({
        user: value.user,
        action: 'CREATE',
        targetModel: 'Payment',
        targetId: order.id,
        description: `Created payment for amount: ${amountCents} cents`,
        req
      });
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

    if (repo && db) {
      const newStatus = success ? 'PAID' : 'FAILED';
      await repo.updatePaymentStatus(db, orderId, newStatus, { webhook: payload });

      // Audit log for payment status update
      await logAction({
        user: null, // webhook may not have a logged-in user
        action: 'UPDATE',
        targetModel: 'Payment',
        targetId: orderId,
        description: `Payment status updated to ${newStatus}`,
        req
      });

      console.log(`Payment ${newStatus.toLowerCase()} for`, orderId);
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('webhook handler error', err);
    return res.status(500).end();
  }
};
