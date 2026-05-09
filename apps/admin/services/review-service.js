import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const reviewService = {
    async getReviewById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/reviews/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch review';
            throw new Error(message);
        }
    },

    async postReview(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/reviews`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create review failed';
            throw new Error(message);
        }
    },

    async patchReview(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/reviews/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update review failed';
            throw new Error(message);
        }
    },

    async deleteReview(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/reviews/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete review failed';
            throw new Error(message);
        }
    }
};
export default reviewService;
