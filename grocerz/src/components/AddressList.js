import React, { useEffect, useState } from 'react';
// import "../style.css";
import axios from 'axios';
import { Link } from 'react-router-dom';

import AddressListData from './AddressListData';
import DashboardRoutes from './DashboardRoutes';

const AddressList = () => {
  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          <div className='blog-bradcrum'>
            <span>
              <Link to='/'>Home</Link>
            </span>
            <span className='devider'>/</span>
            <span>
              <Link to='/dashboard'>Dashboard</Link>
            </span>
          </div>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>User Dashboard</h1>
          </div>
        </div>
      </section>

      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />

              <div
                className='tab-content nav-content'
                id='v-pills-tabContent'
                style={{ flex: '1 0%' }}
              >
                <div
                  className='tab-pane fade show active'
                  id='v-pills-home'
                  role='tabpanel'
                  aria-labelledby='v-pills-home-tab'
                  tabIndex={0}
                >
                  <div className='user-profile'>
                    <div className='profile-section'>
                      <div className='row g-5'>
                        <div className='container'>
                          <div className='row'>
                            <div className='col-lg-12'>
                              <Link to='/addressnew' class='shop-btn'>
                                Add a new address
                              </Link>
                            </div>
                          </div>
                        </div>
                        <AddressListData />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddressList;
