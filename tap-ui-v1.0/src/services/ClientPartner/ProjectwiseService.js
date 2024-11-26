import axios from "axios";

const API_URL = "http://localhost:8080/tap/mrf/getAllMrf";

const ProjectwiseService = {
  async fetchProjectwiseData() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching projectwise data:", error);
      throw error; 
    }
  },
};

export default ProjectwiseService;