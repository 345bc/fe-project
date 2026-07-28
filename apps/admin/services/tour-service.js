import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const tourService = {
    async getAllTours() {
        try {
            const res = await tokenBearer.get(`${baseURL}/tours`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch tours';
            throw new Error(message);
        }
    },

    async getTourById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/tours/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch tour';
            throw new Error(message);
        }
    },

    async postTour(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/tours`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create tour failed';
            throw new Error(message);
        }
    },

    async patchTour(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/tours/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update tour failed';
            throw new Error(message);
        }
    },

    async deleteTour(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/tours/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete tour failed';
            throw new Error(message);
        }
    }
};
export default tourService;
