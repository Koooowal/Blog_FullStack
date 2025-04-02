import { createContext , useEffect, useState} from 'react';
import apiRequest from '../Utility/apiRequest';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const login = async (inputs) => {
    const res = await apiRequest.post('/api/auth/login', inputs);
    setCurrentUser(res.data);
  }

  const logout = async (inputs) => {
    await apiRequest.post('/api/auth/logout', inputs);
    setCurrentUser(null);
  }

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
