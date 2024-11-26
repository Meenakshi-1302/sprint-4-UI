import axios from "axios";

const BASE_API_URL = "http://localhost:8080";

export const fetchDatewiseData = async (fromDate, toDate) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/tap/api/allRequirements`, {
            params: {
                from: fromDate,
                to: toDate,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching datewise data:", error);
        throw new Error("Could not fetch datewise data. Please try again later.");
    }
};

export const fetchMrfData = async (fromDate, toDate) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/tap/mrf/getAllMrf`, {
            params: {
                from: fromDate,
                to: toDate,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching MRF data:", error);
        throw new Error("Could not fetch MRF data. Please try again later.");
    }
};