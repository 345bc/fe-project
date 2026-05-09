import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const blogService = {
    async getBlogById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/blogs/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch blog';
            throw new Error(message);
        }
    },

    async postBlog(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/blogs`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create blog failed';
            throw new Error(message);
        }
    },

    async patchBlog(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/blogs/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update blog failed';
            throw new Error(message);
        }
    },

    async deleteBlog(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/blogs/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete blog failed';
            throw new Error(message);
        }
    }
};
export default blogService;
