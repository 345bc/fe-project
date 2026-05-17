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
            const message = e.response?.data?.message;
            throw new Error(message);
        }
    },


};
export default destinationService;
