import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const destinationService = {
    async getDestinations(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/destinations/group/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể tải danh sách điểm đến";
            throw new Error(message);
        }
    },

    async getAll() {
        try {
            const res = await tokenBearer.get(`${baseURL}/destinations`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể tải tất cả điểm đến";
            throw new Error(message);
        }
    },

    async getDestinationById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/destinations/${id}`);
            return res.data.data;
        } catch (e) {
            return null;
        }
    },
};
export default destinationService;

