import React, { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const DataAppContext = React.createContext();

const DataApp = props => {
  const getInitialDeviceWidth = () => window.innerWidth;

  const initialValues = {
    loginstatus: false,
    username: 'User 1',
    showmenu: false,
    bgColor: 'white',
    deviceWidth: getInitialDeviceWidth(), 
  };
  const [appstate, setAppState] = useState(initialValues);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate();
  

  const updateWishlistCount = (count) => {
    setWishlistCount(count);
  };
  const updateCartCount = (count) => {
    setCartCount(count);
  };
  const checkLogin = () => {
    let token = localStorage.getItem('jwttoken');
    if(token){
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; 
      if (decoded.exp && decoded.exp < now) {
        logout_user();
      } else {
        setAppState((prev) => ({ ...prev, loginstatus: true }));
      }
    } catch (err) {
      console.error('Invalid token:', err);
      logout_user(); 
    }
  } else {
    setAppState((prev) => ({ ...prev, loginstatus: false }));
  }
  };

  useEffect(() => {
    checkLogin();
  

    const width = window.innerWidth;
    setAppState(prev => ({ ...prev, deviceWidth: width }));
  }, []);

  const login = () => {
    setAppState({ ...appstate, loginstatus: !appstate.loginstatus });
  };
  const login_user = () => {
    //console.log('logging in context...')
    setAppState({ ...appstate, loginstatus: true });
  };
  const logout_user = () => {
    // console.log('logging out');
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('userid');
    localStorage.removeItem('usertype');
    // localStorage.removeItem('cart');
    setAppState({ ...appstate, loginstatus: false });
    setShowSessionExpired(true);
  };

  const showhidemenu = () => {
    // console.log('showhidemenu');
    setAppState({ ...appstate, showmenu: !appstate.showmenu });
  };

  return (
    <DataAppContext.Provider
      value={{ appstate, login, login_user, logout_user, showhidemenu , updateWishlistCount, wishlistCount, updateCartCount, cartCount,showSessionExpired,setShowSessionExpired }}
    >
      <div className='app-wrapper'>{props.children}</div>
    </DataAppContext.Provider>
  );
};

export default DataApp;

export { DataAppContext };
