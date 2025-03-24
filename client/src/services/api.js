import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_RUL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const employeeService = {
  getEmployees: (page = 1, limit = 10, search = "") => {
    return api.get(`/employees?page=${page}&limit=${limit}&search=${search}`);
  },

  // Get employee by ID
  getEmployee: (id) => {
    return api.get(`/employees/${id}`);
  },

  // Create new employee
  createEmployee: (employeeData) => {
    // For form data with file upload
    const formData = new FormData();

    // Append employee data
    Object.keys(employeeData).forEach((key) => {
      if (key !== "profileImage") {
        formData.append(key, employeeData[key]);
      }
    });

    // Append profile image if exists
    if (employeeData.profileImage) {
      formData.append("profileImage", employeeData.profileImage);
    }

    return api.post("/employees", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update employee
  updateEmployee: (id, employeeData) => {
    // For form data with file upload
    const formData = new FormData();

    // Append employee data
    Object.keys(employeeData).forEach((key) => {
      if (key !== "profileImage") {
        formData.append(key, employeeData[key]);
      }
    });

    // Append profile image if exists
    if (employeeData.profileImage) {
      formData.append("profileImage", employeeData.profileImage);
    }

    return api.put(`/employees/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete employee
  deleteEmployee: (id) => {
    return api.delete(`/employees/${id}`);
  },
};

// Auth API services
export const authService = {
  login: (credentials) => {
    return api.post("/auth/login", credentials);
  },

  register: (userData) => {
    return api.post("/auth/register", userData);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default api;
