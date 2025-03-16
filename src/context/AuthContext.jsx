import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  register: async () => {
    throw new Error("register function not implemented");
  },
  login: async () => {
    throw new Error("login function not implemented");
  },
  logout: () => {
    throw new Error("logout function not implemented");
  },
});

export default AuthContext;
