import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const tourService = {
    async getTours(sort) {
        try {
            const res = await tokenBearer.get(`${baseURL}/tours`, {
                withCredentials: true,
                params: sort ? { sort } : {}
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể tải danh sách tour";
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
            const message = e.response?.data?.message || e.message || "Không thể tải chi tiết tour";
            throw new Error(message);
        }
    },

    async getTourByDestination(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/tours/destination/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể tải tour theo điểm đến";
            throw new Error(message);
        }
    },

    async getToursRelated(id){
         try {
            const res = await tokenBearer.get(`${baseURL}/tours/related/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể tải tour liên quan";
            throw new Error(message);
        }
    }
};
export default tourService;
