import { authService } from "../../services/api";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_ERROR,
  CLEAR_ERRORS,
} from "../types";

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });

    const res = await authService.register(userData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    const errorMessage =
      err.response && err.response.data.message
        ? err.response.data.message
        : "Registration failed";

    dispatch({
      type: REGISTER_FAIL,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }
};

// Login user
export const login = (userData) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const res = await authService.login(userData);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    const errorMessage =
      err.response && err.response.data.message
        ? err.response.data.message
        : "Login failed";

    dispatch({
      type: LOGIN_FAIL,
      payload: errorMessage,
    });

    throw new Error(errorMessage);
  }
};

// Logout user
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
