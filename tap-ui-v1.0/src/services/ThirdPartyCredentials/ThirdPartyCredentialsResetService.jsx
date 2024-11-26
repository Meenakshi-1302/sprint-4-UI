import axios from "axios";

const API_URL = "http://localhost:8080/user/password/recovery/";

export const resetPassword = async (email, oldPassword, newPassword) => {
  try {
    const response = await axios.put(
      API_URL + "thirdParty-reset-password",
      null,
      {
        params: {
          email,
          oldPassword,
          newPassword,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching email!", error);
    throw error;
  }
};
