export const paymentRepo = {
    async createPaymentRecord(db, payload) {
        return db.Payment.create(payload);
    },
    async updatePaymentStatus(db, orderId, status, extra = {}) {
        return db.Payment.findOneAndUpdate({ orderId }, { status, ...extra }, { new: true, upsert: false });
    },
    async findByOrderId(db, orderId) {
        return db.Payment.findOne({ orderId });
    },
};