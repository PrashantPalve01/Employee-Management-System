// redux/reducers/employeeReducer.js
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

const initialState = {
  employees: [],
  employee: null,
  loading: false,
  error: null,
  success: false,
  deleted: false,
  totalEmployees: 0,
  totalPages: 0,
  currentPage: 1,
  searchTerm: "",
  uploadedImage: null,
};

export const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get all employees
    case GET_EMPLOYEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_EMPLOYEES_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: action.payload.data,
        totalEmployees: action.payload.totalEmployees,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
      };
    case GET_EMPLOYEES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get single employee
    case GET_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        employee: action.payload,
      };
    case GET_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Create employee
    case CREATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case CREATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        employees: [action.payload, ...state.employees],
      };
    case CREATE_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    // Update employee
    case UPDATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        employee: action.payload,
        employees: state.employees.map((employee) =>
          employee._id === action.payload._id ? action.payload : employee
        ),
      };
    case UPDATE_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    // Delete employee
    case DELETE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        deleted: false,
      };
    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        deleted: true,
        employees: state.employees.filter(
          (employee) => employee._id !== action.payload
        ),
      };
    case DELETE_EMPLOYEE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        deleted: false,
      };

    // Upload image
    case UPLOAD_IMAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        uploadedImage: action.payload,
      };
    case UPLOAD_IMAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Search employees (client-side filtering if needed)
    case SEARCH_EMPLOYEES:
      return {
        ...state,
        searchTerm: action.payload,
      };

    // Set current page
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    // Clear errors
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default employeeReducer;
