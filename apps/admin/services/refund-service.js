import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const refundService = {
    async getRefundById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/refunds/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch refund';
            throw new Error(message);
        }
    },

    async postRefund(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/refunds`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create refund failed';
            throw new Error(message);
        }
    },

    async patchRefund(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/refunds/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update refund failed';
            throw new Error(message);
        }
    },

    async deleteRefund(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/refunds/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete refund failed';
            throw new Error(message);
        }
    }
};
export default refundService;
