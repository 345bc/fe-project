import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const discountService = {
    async getDiscountById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/discounts/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch discount';
            throw new Error(message);
        }
    },

    async postDiscount(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/discounts`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create discount failed';
            throw new Error(message);
        }
    },

    async patchDiscount(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/discounts/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update discount failed';
            throw new Error(message);
        }
    },

    async deleteDiscount(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/discounts/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete discount failed';
            throw new Error(message);
        }
    }
};
export default discountService;
