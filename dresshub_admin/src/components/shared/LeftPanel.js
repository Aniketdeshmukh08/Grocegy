import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DataAppContext } from '../../DataContext';

const LeftPanel = ({ complaintCount }) => {
  const { appstate, logout_user } = useContext(DataAppContext);
  const { leftPanelVisible, loginstatus } = appstate;
  const panelRef = useRef(null);

  const getLinkClass = ({ isActive }) =>
    `nav-link d-block px-3 py-2 rounded text-success ${isActive ? 'fw-semibold bg-success bg-opacity-25' : 'text-decoration-none'
    }`;


  useEffect(() => {
    if (panelRef.current) {
      if (leftPanelVisible) {
        panelRef.current.classList.add("active");
        panelRef.current.classList.remove("hidden");
      } else {
        panelRef.current.classList.remove("active");
        panelRef.current.classList.add("hidden");
      }
    }
  }, [leftPanelVisible]);



  return (
    <>
      {loginstatus && (
        <aside ref={panelRef} className="left-panel min-vh-100 shadow"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'fixed',
          }}

        >
          <nav className="navbar navbar-expand-sm navbar-light">
            <div className="main-menu collapse navbar-collapse">
              <ul className="nav flex-column w-100 py-3 px-2">
                <li><NavLink
                  to="/admindashboard" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>⚙️Dashboard</span></NavLink></li>
                <li className="menu-title fw-bold text-uppercase text-success mb-2"><span style={{ cursor: 'pointer' }}>Reports</span></li>
                <li><NavLink
                  to="/detailedreport" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📊 Report Settlement</span></NavLink></li>
                <li><NavLink
                  to="/dailyreport" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📅 Daily Report</span></NavLink></li>
                <li><NavLink
                  to="/reportgeneration" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>👥 Customer Report</span></NavLink></li>
                <li><NavLink
                  to="/salesstatistics" className={getLinkClass}>📈 Sales Statistics</NavLink></li>
                <li className="menu-title fw-bold text-uppercase text-success mt-4 mb-2"><span style={{ cursor: 'pointer' }}>Product Operations</span> </li>
                <li><NavLink
                  to="/brandlist" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>🏷️ Brands</span> </NavLink></li>
                <li><NavLink
                  to="/categoryDetails" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📂 Category</span> </NavLink></li>
                <li><NavLink
                  to="/subcategorylist" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📁 Sub-Category</span> </NavLink></li>
                <li><NavLink
                  to="/feedbacklist" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>✅ Feedbacks</span> </NavLink></li>
                <li><NavLink
                  to="/productslist" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📦 Products</span> </NavLink></li>
                <li><NavLink
                  to="/productslist-replicate" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📦 Products Replicate</span> </NavLink></li>
                <li><NavLink
                  to="/customproductlist" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>🔧 Custom Product</span> </NavLink></li>

                <li className="menu-title fw-bold text-uppercase text-success mt-4 mb-2"><span style={{ cursor: 'pointer' }}>Users</span> </li>
                <li><NavLink
                  to="/userslist" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>👤 Users</span> </NavLink></li>
                <li><NavLink
                  to="/usersDetails" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>🔍 Users Details</span> </NavLink></li>
                <li><NavLink
                  to="/customerDetails" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>🛒 Customers</span> </NavLink></li>
                <li><NavLink
                  to="/addressdetails" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📍 Address</span> </NavLink></li>


                <li className="menu-title fw-bold text-uppercase text-success mt-4 mb-2"><span style={{ cursor: 'pointer' }}>Orders & Features</span> </li>
                <li><NavLink
                  to="/orders" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>🧾 Orders</span> </NavLink></li>
                <li><NavLink
                  to="/custom-orders" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>🧾 Custom Orders</span> </NavLink></li>
                <li><NavLink
                  to="/orderDetails" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📄 Order Details</span> </NavLink></li>
                <li><NavLink
                  to="/cancelledorders" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>❌ Cancelled Orders</span> </NavLink></li>
                <li><NavLink
                  to="/deletedorders" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>🗑️ Deleted Orders</span> </NavLink></li>
                <li><NavLink
                  to="/complainslist" className={getLinkClass} style={{
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    whiteSpace: 'nowrap',
                    minWidth: '180px',

                  }}
                >
                  <span style={{ cursor: 'pointer' }}>🗣️ Complaints</span>
                  {complaintCount > 0 && (
                    <span className="fw-bold ms-2">
                      (
                      <span style={{ color: 'red' }}>{complaintCount}</span>
                      )
                    </span>
                  )}
                </NavLink>
                </li>
                <li><NavLink
                  to="/contactList" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📞 Contact</span> {complaintCount > 0 && (
                    <span className="fw-bold ms-2">
                      (
                      <span style={{ color: 'red' }}>{complaintCount}</span>
                      )
                    </span>
                  )} </NavLink></li>
                <li><NavLink
                  to="/discountlist" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>💸 Discounts</span> </NavLink></li>
                <li><NavLink
                  to="/wishlist" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>❤️ WishList</span> </NavLink></li>

                <li className="menu-title fw-bold text-uppercase text-success mt-4 mb-2"><span style={{ cursor: 'pointer' }}>Management</span> </li>
                <li><NavLink
                  to="/testimonials" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>💬 Testimonials</span></NavLink></li>
                <li><NavLink
                  to="/vendorDetails" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>🏪 Vendors</span> </NavLink></li>
                <li><NavLink
                  to="/TeamList" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>👨‍👩‍👧 Our Team</span> </NavLink></li>
                <li><NavLink
                  to="/faq" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>❓ FAQ</span> </NavLink></li>
                <li><NavLink
                  to="/pincodes" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📍 Pincodes</span> </NavLink></li>
                <li><NavLink
                  to="/settingslist" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>⚙️ Settings</span> </NavLink></li>
                <li><NavLink
                  to="/img_generation" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>🖼️ Image Generation</span> </NavLink></li>
                <li><NavLink
                  to="/imageList" className={getLinkClass} style={{ cursor: 'default' }}><span style={{ cursor: 'pointer' }}>📷 Image Upload</span> </NavLink></li>

                <button onClick={() => logout_user()} className="mt-4 border-0 bg-danger bg-opacity-25 rounded nav-link d-block px-3 py-2 text-danger"
                  style={{ cursor: 'default' }}>
                  <span style={{ cursor: 'pointer' }}>🚪Logout</span>
                </button>


                {/* <button
                  onClick={e=>toggleLeftPanel()}
                  className="mt-4 border-0 bg-danger bg-opacity-25 rounded nav-link d-block px-3 py-2 text-danger menu-shrink-button"
                >
                  ⬅️ Shrink panel
                </button> */}

              </ul>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
};

export default LeftPanel;
