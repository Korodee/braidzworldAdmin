export interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@braidzworld.com";
const ADMIN_PASSWORD = "admin123";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if credentials match admin
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new Error("Invalid credentials");
    }

    // Create admin user response
    const user = {
      id: "admin-1",
      name: "Admin",
      email: ADMIN_EMAIL,
      role: "admin",
    };

    // Create token
    const token = "admin-token";

    // Store the token and user info
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    return {
      token,
      user,
    };
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}; 