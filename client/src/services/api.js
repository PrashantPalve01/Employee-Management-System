import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

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
  getEmployees: (
    page = 1,
    limit = 10,
    search = "",
    department = "",
    status = ""
  ) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(department && { department }),
      ...(status && { status }),
    });

    return api.get(`/employees?${queryParams}`);
  },

  // Rest of the service methods remain the same
  getEmployee: (id) => {
    return api.get(`/employees/${id}`);
  },

  createEmployee: (employeeData) => {
    const formData = new FormData();

    Object.keys(employeeData).forEach((key) => {
      if (key === "address" || key === "emergencyContact") {
        formData.append(key, JSON.stringify(employeeData[key]));
      } else if (key !== "profileImage") {
        formData.append(key, employeeData[key]);
      }
    });

    if (employeeData.profileImage) {
      formData.append("profileImage", employeeData.profileImage);
    }

    return api.post("/employees", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateEmployee: (id, employeeData) => {
    const formData = new FormData();

    Object.keys(employeeData).forEach((key) => {
      if (key === "address" || key === "emergencyContact") {
        formData.append(key, JSON.stringify(employeeData[key]));
      } else if (key !== "profileImage") {
        formData.append(key, employeeData[key]);
      }
    });

    if (employeeData.profileImage) {
      formData.append("profileImage", employeeData.profileImage);
    }

    return api.put(`/employees/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteEmployee: (id) => {
    return api.delete(`/employees/${id}`);
  },
};

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
