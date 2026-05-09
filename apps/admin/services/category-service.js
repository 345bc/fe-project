import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const categoryService = {
    async getCategoryById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/categories/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch category';
            throw new Error(message);
        }
    },

    async postCategory(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/categories`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create category failed';
            throw new Error(message);
        }
    },

    async patchCategory(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/categories/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update category failed';
            throw new Error(message);
        }
    },

    async deleteCategory(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/categories/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete category failed';
            throw new Error(message);
        }
    }
};
export default categoryService;
