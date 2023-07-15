import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";
import { axiosJWT } from "../apiCalls";
try {
  var user_data = JSON.parse(localStorage.getItem("user"));
} catch (error) {
  var user_data = {}
}

const INITIAL_STATE = {
  user: user_data,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
