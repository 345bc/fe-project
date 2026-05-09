import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const blogCategoryService = {
    async getBlogCategoryById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/blog-categories/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch blog category';
            throw new Error(message);
        }
    },

    async postBlogCategory(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/blog-categories`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create blog category failed';
            throw new Error(message);
        }
    },

    async patchBlogCategory(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/blog-categories/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update blog category failed';
            throw new Error(message);
        }
    },

    async deleteBlogCategory(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/blog-categories/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete blog category failed';
            throw new Error(message);
        }
    }
};
export default blogCategoryService;
