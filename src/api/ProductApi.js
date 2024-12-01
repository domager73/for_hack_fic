import axios from "axios";

class ApiService {
    static BASE_URL = "http://localhost:5031/product/";

    static async getAllProducts() {
        try {
            const response = await axios.get(`${this.BASE_URL}get-all`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch products");
        }
    }

    static async getFilteredProducts(filter) {
        try {
            const response = await axios.post(`${this.BASE_URL}get-filtered`, filter);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch filtered products");
        }
    }
}

export default ApiService;
