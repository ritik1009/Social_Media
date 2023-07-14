import axios from "axios";
// Creating onemore axios object for JWT feature
import jwt_decode from "jwt-decode";
export const axiosJWT = axios.create()


export const loginCall = async(userCredentials, dispatch)=>{
    dispatch({type:"LOGIN_START"});
    try{
        const res = await axios.post("http://localhost:8800/api/auth/login",userCredentials);
        console.log("Dispatch----",res.data);
        localStorage.setItem('aToken',res.data.accessToken)
        localStorage.setItem('rToken',res.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        dispatch({type:"LOGIN_SUCCESS",payload:res.data.user});
        
    }catch (err){
        dispatch({type:"LOGIN_FAILURE",payload:err});
    }
}


const RefreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('rToken')
        const userId = localStorage.getItem('user')
        const res = await axios.post("http://localhost:8800/api/auth/refresh/"+userId, { token: refreshToken });
        localStorage.setItem('aToken',res.data.accessToken)
        localStorage.setItem('rToken',res.data.refreshToken)
        return res.data;
    } catch (err) {
      console.log(err);
    }
  };

axiosJWT.interceptors.request.use(
    async (config) => {
        RefreshToken()
      let currentDate = new Date();
      const accessToken = localStorage.getItem('aToken')
      const decodedToken = jwt_decode(accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await RefreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      else{
            config.headers["authorization"] = "Bearer " + accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );