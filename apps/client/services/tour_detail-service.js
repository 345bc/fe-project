import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const tourDetailService = {
    async getTourDetails() {
        try {
            const res = await tokenBearer.get(`${baseURL}/tour-details`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message;
            throw new Error(message);
        }
    },

    async getTourDetailById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/tour-details/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message;
            throw new Error(message);
        }
    },

    async getTourDetailByTourId(tourId) {
        try {
            const res = await tokenBearer.get(`${baseURL}/tour-details/tours/${tourId}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message;
            throw new Error(message);
        }
    },

    async getSubImagesByTourDetailId(tourDetailId) {
        try {
            const res = await tokenBearer.get(`${baseURL}/sub-images/tour-details/${tourDetailId}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Failed to fetch sub-images";
            throw new Error(message);
        }
    }
};

export default tourDetailService;
