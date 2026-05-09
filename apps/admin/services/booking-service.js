import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const bookingService = {
    async getBookingById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/bookings/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch booking';
            throw new Error(message);
        }
    },

    async postBooking(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/bookings`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create booking failed';
            throw new Error(message);
        }
    },

    async patchBooking(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/bookings/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update booking failed';
            throw new Error(message);
        }
    },

    async deleteBooking(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/bookings/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete booking failed';
            throw new Error(message);
        }
    }
};
export default bookingService;
