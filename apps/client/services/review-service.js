import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const reviewService = {
    async createReview(reviewData) {
        try {
            const res = await tokenBearer.post(`${baseURL}/reviews`, reviewData, {
                withCredentials: true,
            });
            return res.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể gửi đánh giá";
            throw new Error(message);
        }
    },

    async getReviewsByTourId(tourId) {
        try {
            const res = await tokenBearer.get(`${baseURL}/reviews/tour/${tourId}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể tải đánh giá";
            throw new Error(message);
        }
    }
};

export default reviewService;
