import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DataAppContext = createContext();

const DataApp = (props) => {
  const initialValues = {
    loginstatus: false,
    username: 'User 1',
    showmenu: false,
    bgColor: 'white',
    leftPanelVisible: true,
  };

  const [appstate, setAppState] = useState(initialValues);
  const navigate = useNavigate();

  const checkLogin = () => {
    const token = localStorage.getItem('jwttoken');
    setAppState((prevState) => ({
      ...prevState,
      loginstatus: !!token
    }));
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const login = () => {
    setAppState(prev => ({ ...prev, loginstatus: !prev.loginstatus }));
  };

  const login_user = () => {
    setAppState(prev => ({ ...prev, loginstatus: true }));
  };

  const logout_user = () => {
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('userid');
    localStorage.removeItem('usertype');
    setAppState(prev => ({ ...prev, loginstatus: false }));
    navigate('/login');
  };

  const showhidemenu = () => {
    setAppState(prev => ({ ...prev, showmenu: !prev.showmenu }));
  };

  const toggleLeftPanel = () => {
    setAppState(prev => ({ ...prev, leftPanelVisible: !prev.leftPanelVisible }));
  };

  return (
    <DataAppContext.Provider
      value={{
        appstate,
        login,
        login_user,
        logout_user,
        showhidemenu,
        toggleLeftPanel,
      }}
    >
      <div className='app-wrapper'>{props.children}</div>
    </DataAppContext.Provider>
  );
};

export default DataApp;
export { DataAppContext };
