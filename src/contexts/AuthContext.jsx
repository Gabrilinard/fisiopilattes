import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  const login = async (email, senha) => {
    try {
      const { data } = await axios.post('http://localhost:4000/login', { email, senha });
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    if (user?.email) {
      localStorage.removeItem(`cart_${user.email}`);
      localStorage.removeItem(`totalAmount_${user.email}`);
    }
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
  };

  const addItemToCart = (item) => {
    if (!user) return;
    setCart((prevCart) => {
      const updatedCart = [...prevCart, item];
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeItemFromCart = (productId) => {
    if (!user || !user.email) {
      console.error('Usuário não encontrado');
      return;
    }
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(item => item.id !== productId);
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const setTotalAmount = (amount) => {
    if (user) {
      localStorage.setItem(`totalAmount_${user.email}`, JSON.stringify(amount));
    }
  };

  return (
    <AuthContext.Provider value={{ user, cart, login, logout, addItemToCart, removeItemFromCart, setTotalAmount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };