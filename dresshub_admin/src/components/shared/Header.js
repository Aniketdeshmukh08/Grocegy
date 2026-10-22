import React, { useContext } from 'react';
import { DataAppContext } from '../../DataContext';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // <-- use bar icon instead of eye icons

const Header = () => {
  const { appstate, toggleLeftPanel, logout_user } = useContext(DataAppContext);

  return (
    <header id="header" className="header d-flex justify-content-between align-items-center px-3">
      <div className="d-flex align-items-center">
        {/* Moved button to left of title */}
        <button
          className="btn btn-sm btn-outline-secondary me-2"
          onClick={toggleLeftPanel}
          title="Toggle Sidebar"
        >
          <FaBars />
        </button>
        <h2 className="mb-0">Grocji Admin</h2>
      </div>

      <div>
        {appstate.loginstatus && (
          <button onClick={logout_user} className="btn btn-outline-danger">
            Logout
          </button>
        )}
        <button className="btn btn-outline-success ms-2">
          <a href="https://grocji.com/" target="_blank" rel="noopener noreferrer">Mainsite</a>
        </button>
      </div>
    </header>
  );
};

export default Header;
