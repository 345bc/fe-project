import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";

const dataminingService = {
    async getAprioriResults(minSupport = 0.05, minConfidence = 0.3) {
        try {
            const res = await tokenBearer.get(`${baseURL}/datamining/apriori`, {
                params: {
                    minSupport,
                    minConfidence
                },
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || e.message || "Không thể tải phân tích dữ liệu";
            throw new Error(message);
        }
    }
};

export default dataminingService;
