import axios from "axios";
import {
  GET_EMPLOYEES_REQUEST,
  GET_EMPLOYEES_SUCCESS,
  GET_EMPLOYEES_FAIL,
  GET_EMPLOYEE_REQUEST,
  GET_EMPLOYEE_SUCCESS,
  GET_EMPLOYEE_FAIL,
  CREATE_EMPLOYEE_REQUEST,
  CREATE_EMPLOYEE_SUCCESS,
  CREATE_EMPLOYEE_FAIL,
  UPDATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAIL,
  DELETE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAIL,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
  SEARCH_EMPLOYEES,
  SET_CURRENT_PAGE,
  CLEAR_ERRORS,
} from "../types";
import { employeeService } from "../../services/api";

// Get all employees with pagination and search
export const getEmployees =
  (page = 1, limit = 10, search = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_EMPLOYEES_REQUEST });
      const { data } = await employeeService.getEmployees(page, limit, search);

      dispatch({
        type: GET_EMPLOYEES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_EMPLOYEES_FAIL,
        payload: error.response?.data?.message || "Failed to fetch employees",
      });
    }
  };

// Get employee by ID
export const getEmployeeById = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_EMPLOYEE_REQUEST });

    const { data } = await employeeService.getEmployee(id);

    console.log("asdasd", data.data);
    dispatch({
      type: GET_EMPLOYEE_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: GET_EMPLOYEE_FAIL,
      payload:
        error.response?.data?.message || "Failed to fetch employee details",
    });
  }
};

export const createEmployee = (employeeData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_EMPLOYEE_REQUEST });

    const { data } = await employeeService.createEmployee(employeeData);

    dispatch({
      type: CREATE_EMPLOYEE_SUCCESS,
      payload: data.data,
    });

    return data.data;
  } catch (error) {
    dispatch({
      type: CREATE_EMPLOYEE_FAIL,
      payload: error.response?.data?.message || "Failed to create employee",
    });
    throw error;
  }
};

// Update employee
export const updateEmployee = (id, employeeData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_EMPLOYEE_REQUEST });

    // Create FormData for file upload
    const formData = new FormData();

    // Append employee data to FormData
    Object.keys(employeeData).forEach((key) => {
      if (key === "profileImage" && employeeData[key] instanceof File) {
        formData.append(key, employeeData[key]);
      } else if (key === "address" || key === "emergencyContact") {
        // Handle nested objects
        Object.keys(employeeData[key]).forEach((nestedKey) => {
          formData.append(`${key}[${nestedKey}]`, employeeData[key][nestedKey]);
        });
      } else {
        formData.append(key, employeeData[key]);
      }
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.put(`/api/employees/${id}`, formData, config);

    dispatch({
      type: UPDATE_EMPLOYEE_SUCCESS,
      payload: data.data,
    });

    return data.data; // Return updated employee for redirect
  } catch (error) {
    dispatch({
      type: UPDATE_EMPLOYEE_FAIL,
      payload: error.response?.data?.message || "Failed to update employee",
    });
    throw error; // Re-throw for component handling
  }
};

// Delete employee
export const deleteEmployee = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_EMPLOYEE_REQUEST });

    await employeeService.deleteEmployee(id);

    dispatch({
      type: DELETE_EMPLOYEE_SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: DELETE_EMPLOYEE_FAIL,
      payload: error.response?.data?.message || "Failed to delete employee",
    });
  }
};

// Upload image (standalone function if needed separately)
export const uploadImage = (file) => async (dispatch) => {
  try {
    dispatch({ type: UPLOAD_IMAGE_REQUEST });

    const formData = new FormData();
    formData.append("profileImage", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(
      "/api/employees/upload",
      formData,
      config
    );

    dispatch({
      type: UPLOAD_IMAGE_SUCCESS,
      payload: data,
    });

    return data; // Return image data
  } catch (error) {
    dispatch({
      type: UPLOAD_IMAGE_FAIL,
      payload: error.response?.data?.message || "Failed to upload image",
    });
    throw error;
  }
};

// Search employees (client-side filtering - optional if server-side search isn't enough)
export const searchEmployees = (searchTerm) => ({
  type: SEARCH_EMPLOYEES,
  payload: searchTerm,
});

// Set current page for pagination
export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

// Clear errors
export const clearErrors = () => ({
  type: CLEAR_ERRORS,
});
