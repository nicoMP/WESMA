import axios from 'axios';

const setAuthToken = (token: string) => {
  if(token) {
    axios.defaults.headers.common['auth-token'] = token;
  }
  else {
    delete axios.defaults.headers.common['auth-token'];
  }
}

export default setAuthToken;