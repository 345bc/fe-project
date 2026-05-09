import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const passengerService = {
    async getPassengerById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/passengers/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch passenger';
            throw new Error(message);
        }
    },

    async postPassenger(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/passengers`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create passenger failed';
            throw new Error(message);
        }
    },

    async patchPassenger(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/passengers/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update passenger failed';
            throw new Error(message);
        }
    },

    async deletePassenger(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/passengers/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete passenger failed';
            throw new Error(message);
        }
    }
};
export default passengerService;
