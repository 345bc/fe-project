import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const categoryService = {
    async getCategories() {
        try {
            const res = await tokenBearer.get(`${baseURL}/categories`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch category';
            throw new Error(message);
        }
    },


};
export default categoryService;
