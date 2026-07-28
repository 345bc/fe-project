import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const bookingService = {
    async createBooking(bookingData) {
        try {
            const res = await tokenBearer.post(`${baseURL}/bookings`, bookingData, {
                withCredentials: true,
            });
            return res.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Đã xảy ra lỗi khi tạo đơn đặt tour";
            throw new Error(message);
        }
    },

    async getBookingsByUserId(userId) {
        try {
            const res = await tokenBearer.get(`${baseURL}/bookings/user/${userId}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể lấy danh sách đơn hàng";
            throw new Error(message);
        }
    },

    async calculatePrice(calculationData) {
        try {
            const res = await tokenBearer.post(`${baseURL}/bookings/calculate`, calculationData, {
                withCredentials: true,
            });
            return res.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Failed to calculate booking price";
            throw new Error(message);
        }
    },

    async cancelBooking(bookingId) {
        try {
            const res = await tokenBearer.put(`${baseURL}/bookings/${bookingId}/cancel`, {}, {
                withCredentials: true,
            });
            return res.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể hủy đơn đặt tour";
            throw new Error(message);
        }
    }
};

export default bookingService;
