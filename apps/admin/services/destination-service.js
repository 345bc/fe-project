import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const destinationService = {
    async getAllDestinations() {
        try {
            const res = await tokenBearer.get(`${baseURL}/destinations`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch destinations';
            throw new Error(message);
        }
    },

    async getDestinationById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/destinations/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch destination';
            throw new Error(message);
        }
    },

    async postDestination(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/destinations`, request, { withCredentials: true });
            return post.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Create destination failed';
            throw new Error(message);
        }
    },

    async patchDestination(id, request) {
        try {
            const res = await tokenBearer.patch(`${baseURL}/destinations/${id}`, request);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Update destination failed';
            throw new Error(message);
        }
    },

    async deleteDestination(id) {
        try {
            const res = await tokenBearer.delete(`${baseURL}/destinations/${id}`);
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Delete destination failed';
            throw new Error(message);
        }
    },

    async getAllDestinationGroups() {
        try {
            const res = await tokenBearer.get(`${baseURL}/destination-groups`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch destination groups';
            throw new Error(message);
        }
    }
};
export default destinationService;
