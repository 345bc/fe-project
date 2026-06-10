import tokenBearer from '@/lib/bearer-token'

const API_URL = 'http://localhost:8080';
const ServiceAddition = {
  async getServiceAddtion() {
        try {
            const res = await tokenBearer.get(`${API_URL}/services`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message;
            throw new Error(message);
        }
    },
};

export default ServiceAddition;