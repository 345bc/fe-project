import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const userService = {
    async getMyInfo() {
        try {
            const res = await tokenBearer.get(`${baseURL}/users/my-info`, {
                withCredentials: true,
            });
            return res.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể lấy thông tin tài khoản";
            throw new Error(message);
        }
    },

    async updateMyInfo(profileData) {
        try {
            const res = await tokenBearer.put(`${baseURL}/users/my-info`, profileData, {
                withCredentials: true,
            });
            return res.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể cập nhật hồ sơ";
            throw new Error(message);
        }
    },

    async getMyBookings() {
        try {
            const res = await tokenBearer.get(`${baseURL}/bookings/my-bookings`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể tải lịch sử đặt tour";
            throw new Error(message);
        }
    }
};

export default userService;
