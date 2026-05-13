import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const blogService = {
    async getBlogs() {
        try {
            const res = await tokenBearer.get(`${baseURL}/blogs`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message;
            throw new Error(message);
        }
    },


};
export default blogService;
