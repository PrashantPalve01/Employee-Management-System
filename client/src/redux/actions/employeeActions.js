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
  SEARCH_EMPLOYEES,
  SET_CURRENT_PAGE,
  CLEAR_ERRORS,
} from "../types";
import { employeeService } from "../../services/api";

export const getEmployees =
  (page = 1, limit = 10, search = "", department = "", status = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_EMPLOYEES_REQUEST });
      const { data } = await employeeService.getEmployees(
        page,
        limit,
        search,
        department,
        status
      );

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

export const getEmployeeById = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_EMPLOYEE_REQUEST });

    const { data } = await employeeService.getEmployee(id);

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

export const updateEmployee = (id, employeeData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_EMPLOYEE_REQUEST });

    const { data } = await employeeService.updateEmployee(id, employeeData);

    dispatch({
      type: UPDATE_EMPLOYEE_SUCCESS,
      payload: data.data,
    });

    return data.data;
  } catch (error) {
    dispatch({
      type: UPDATE_EMPLOYEE_FAIL,
      payload: error.response?.data?.message || "Failed to update employee",
    });
    throw error;
  }
};

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

export const searchEmployees = (searchTerm) => ({
  type: SEARCH_EMPLOYEES,
  payload: searchTerm,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const clearErrors = () => ({
  type: CLEAR_ERRORS,
});
