import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const paymentService = {
    async createPaymentUrl(bookingId) {
        try {
            const res = await tokenBearer.get(`${baseURL}/payments/vnpay/create-url`, {
                params: { bookingId },
                withCredentials: true,
            });
            return res.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Failed to create payment URL";
            throw new Error(message);
        }
    },

    async verifyPayment(params) {
        try {
            const res = await tokenBearer.get(`${baseURL}/payments/vnpay/verify`, {
                params,
                withCredentials: true,
            });
            return res.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Failed to verify payment";
            throw new Error(message);
        }
    }
};

export default paymentService;
