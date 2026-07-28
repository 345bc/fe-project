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
    }
};

export default bookingService;
