import axios from 'axios';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';

//Load User
export const loadUser = () => async dispatch => {
  if(localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get('http://localhost:5000/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

//Login User
export const loginUser = (username: string, password: string) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ username, password });

  try {
    const res = await axios.post('http://localhost:5000/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const logoutUser = () => dispatch => { dispatch({ type: LOGOUT }); }