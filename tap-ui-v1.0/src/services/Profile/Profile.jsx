import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/tap'; // Replace with your actual API base URL

export const getUserLoginCredentialsById = async (userId) => {
    console.log("HI BRO");
    userId = sessionStorage.getItem('UserId');
    // userId =1;
    try {
        const response = await axios.get(`${API_BASE_URL}/login-credentials/${userId}`); // Replace with actual endpoint
        return response.data;
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching user login credentials:", error);
        throw error; // Re-throw the error for handling in the calling component
    }
};

// Function to format user data
export const formatUserProfile = (userData) => {
    if (!userData || !userData.employee) {
        return null; // Return null if userData or employee is not available
    }

    const { employeeEmail, role } = userData.employee;
    
    // Extract the first letter of the email and the part before the @
    const firstLetterOfEmail = employeeEmail.charAt(0).toUpperCase();
    const name = employeeEmail.split('@')[0].replace(/\d+/g, ''); // Remove digits from name
    const roleName = role.roleName;

    // Construct avatar URL
    const profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstLetterOfEmail)}&rounded=true&size=285`;

    return {
        profilePic, // Using the new avatar URL
        name: `${name} - ${roleName}` // First line name, second line role
    };
};