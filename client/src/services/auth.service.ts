import axios from "axios";
import setAuthToken from '../utils/setAuthToken';

const API_URL = "http://localhost:5000/api/auth";

class AuthService {
  async login(username: string, password: string) {
    const res = await axios
      .post(API_URL, {
        username,
        password
      })
      
      if (res.data.token) {
        localStorage.setItem("token", JSON.stringify(res.data));
      }

      return res.data;
  }

  logout() {
    localStorage.removeItem("token");
  }

  async getCurrentUser() {
    if(localStorage.token) {
      setAuthToken(localStorage.token)
    }
  
    try {
      const res = await axios.get('http://localhost:5000/api/auth');
      return res.data;

    } catch (err) {
      console.log(err);
    }
  }
}

export default new AuthService();