import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const tourService = {
    async getTours() {
        try {
            const res = await tokenBearer.get(`${baseURL}/tours`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message;
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
            const message = e.response?.data?.message;
            throw new Error(message);
        }
    },
};
export default tourService;
