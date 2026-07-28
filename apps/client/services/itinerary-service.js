import tokenBearer from '@/lib/bearer-token'

const API_URL = 'http://localhost:8080';
const itineraryService = {
  async getItinerary(id) {
        try {
            const res = await tokenBearer.get(`${API_URL}/itineraries/tour-details/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể tải lịch trình";
            throw new Error(message);
        }
    },
};

export default itineraryService;