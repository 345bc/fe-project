import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const transportService = {
    async getTransportById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/transports/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch transport';
            throw new Error(message);
        }
    },

    async postTransport(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/transports`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create transport failed';
            throw new Error(message);
        }
    },

    async patchTransport(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/transports/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update transport failed';
            throw new Error(message);
        }
    },

    async deleteTransport(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/transports/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete transport failed';
            throw new Error(message);
        }
    }
};
export default transportService;
