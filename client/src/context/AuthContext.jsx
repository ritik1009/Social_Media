import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";
const INITIAL_STATE = {
  user: {
    _id: "64a6d1d7afd71e3ab5e3f9e6",
    username: "demo9",
    email: "demo9@gmail.com",
    password: "$2b$10$W60KFWGIPMid9c6GitqsHuCmnqssTbAfIZwOFJmmfiEBhr2FNGHby",
    profilePicture:
      "https://plus.unsplash.com/premium_photo-1669050702468-d91e80be4126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
    coverPicture:
      "https://images.unsplash.com/photo-1688636958122-0a26b80b1b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=600&q=60",
    isAdmin: false,
    following:[]
  },
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
