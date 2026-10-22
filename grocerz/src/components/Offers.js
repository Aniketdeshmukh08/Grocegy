import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  toast } from 'react-toastify';
import axios from 'axios';
import ErrorRedirectPage from './ErrorRedirectPage';

const Offers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}discount/alloffers`;
        const response = await axios.get(url);
        setApiError(false)
        setTeamMembers(response.data);
      } catch (error) {
        toast.error('Error fetching team members.');
        setApiError(true);
        console.error(error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleViewDetails = member => {
    setSelectedMember(member);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMember(null);
  };

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          {/* <div className='blog-bradcrum'>
            <span>
              <a href='/home'>Home</a>
            </span>
            <span className='devider'>/</span>
            <span>Discounts & Offers</span>
          </div> */}
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Discounts & Offers</h1>
          </div>
        </div>
      </section>
      
      
      {/* {apiError && <ErrorRedirectPage/>} */}
      {apiError && <ErrorRedirectPage msg="Our servers are currently unavailable. Please try again later."/>}


      {/* Render container if only one discount is available */}
      {teamMembers.length === 1 && (
        <section class='product best-product mb-5'>
          <div class='container'>
            <div class='best-product-section'>
              <div class='product-wrapper d-flex align-items-center'>
                {teamMembers.map(member => (
                  <>
                    <div
                      class='product-info'
                      id='info-left'
                      style={{ width: '50%' }}
                      key={member.id}
                    >
                      <h3 class='wrapper-heading'>{member.discountname}</h3>
                      <p class='wrapper-details'>
                        PROMOCODE: {member.discountid}
                        <br />
                        {member.amount > 0 &&
                          `Fixed Discount: ₹${member.amount}`}
                        <br />
                        {member.percentage > 0 &&
                          `Percentage Discount: ${member.percentage}%`}
                        <br />
                        Valid Till: {member.enddate.substring(8, 10)}/
                        {member.enddate.substring(5, 7)}/
                        {member.enddate.substring(0, 4)}
                      </p>
                      {/* <Link
                        to='#'
                        className='shop-btn'
                        onClick={() => handleViewDetails(member)}
                      >
                        View Details
                        <span>
                          <svg
                            width='8'
                            height='14'
                            viewBox='0 0 8 14'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <rect
                              x='1.45312'
                              y='0.914062'
                              width='9.25346'
                              height='2.05632'
                              transform='rotate(45 1.45312 0.914062)'
                            />
                            <rect
                              x='8'
                              y='7.45703'
                              width='9.25346'
                              height='2.05632'
                              transform='rotate(135 8 7.45703)'
                            />
                          </svg>
                        </span>
                      </Link> */}
                    </div>

                    <div class='text-center' style={{ width: '50%' }}>
                      {member.image && (
                        <img
                          src={`${process.env.REACT_APP_API_URL}${member.image}`}
                          alt={member.discountname}
                          width='160'
                          class='img-fluid'
                        />
                      )}
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className='container'>
        {/* Render containers if two discounts are available */}
        <div className='grocery-section mb-5'>
          <div className='row g-5 justify-content-center'>
            {teamMembers.length === 2 &&
              teamMembers.map((member, index) => (
                <div className='col-md-6' key={member.id}>
                  <div
                    className={`product-wrapper ${index === 0 ? 'wrapper-left' : 'wrapper-right'}`}
                    style={{
                      minHeight: '320px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px', 
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      className='wrapper-info d-flex flex-column justify-content-center'
                      style={{
                        width: '50%',
                        textAlign: 'left',
                        padding: '10px 20px', 
                        boxSizing: 'border-box',
                      }}
                    >
                      <span className='wrapper-subtitle'>
                        {member.discountname}
                      </span>
                      <h5 className='wrapper-details'>
                        PROMOCODE: {member.discountid}
                      </h5>
                      <p>
                        {member.amount > 0 &&
                          `Fixed Discount: ₹${member.amount}`}
                        {member.percentage > 0 &&
                          `Percentage Discount: ${member.percentage}%`}
                        <br />
                        Valid Till: {member.enddate.substring(8, 10)}/
                        {member.enddate.substring(5, 7)}/
                        {member.enddate.substring(0, 4)}
                      </p>
                      {/* <Link
                        to='#'
                        className='shop-btn'
                        onClick={() => handleViewDetails(member)}
                      >
                        View Details
                        <span>
                          <svg
                            width='8'
                            height='14'
                            viewBox='0 0 8 14'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <rect
                              x='1.45312'
                              y='0.914062'
                              width='9.25346'
                              height='2.05632'
                              transform='rotate(45 1.45312 0.914062)'
                            />
                            <rect
                              x='8'
                              y='7.45703'
                              width='9.25346'
                              height='2.05632'
                              transform='rotate(135 8 7.45703)'
                            />
                          </svg>
                        </span>
                      </Link> */}
                    </div>

                    {/* Image Section */}
                    <div
                      className='d-flex justify-content-center align-items-center'
                      style={{
                        width: '50%',
                        padding: '10px', 
                        boxSizing: 'border-box',
                      }}
                    >
                      {member.image && (
                        <img
                          src={`${process.env.REACT_APP_API_URL}${member.image}`}
                          alt={member.discountname}
                          width='160'
                          className='img-fluid'
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Render containers if three or more discounts are available */}
        {teamMembers.length >= 3 && (
          <div className='healthy-section mb-5'>
            <div className='row gy-4 gx-5 gy-lg-0'>
              {teamMembers.map((member, index) => (
                <div className='col-lg-4 col-md-6' key={member.id}>
                  <div
                    className={`product-wrapper wrapper-${index + 1}`}
                    data-aos='fade-up'
                  >
                    <div className='wrapper-img p-2'>
                      {member.image && (
                        <img
                          src={`${process.env.REACT_APP_API_URL}${member.image}`}
                          alt={member.discountname}
                          style={{ display: 'block', margin: '0 auto' }}
                        />
                      )}
                    </div>
                    <div className='wrapper-info'>
                      <h2 className='wrapper-details'>{member.discountname}</h2>
                      <p>
                        PROMOCODE: {member.discountid}
                        <br />
                        {member.amount > 0 &&
                          `Fixed Discount: ₹${member.amount}`}
                        <br />
                        {member.percentage > 0 &&
                          `Percentage Discount: ${member.percentage}%`}
                        <br />
                        Valid Till: {member.enddate.substring(8, 10)}/
                        {member.enddate.substring(5, 7)}/
                        {member.enddate.substring(0, 4)}
                      </p>
                      {/* <Link
                        to='#'
                        className='shop-btn'
                        onClick={() => handleViewDetails(member)}
                      >
                        View Details
                        <span>
                          <svg
                            width='8'
                            height='14'
                            viewBox='0 0 8 14'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <rect
                              x='1.45312'
                              y='0.914062'
                              width='9.25346'
                              height='2.05632'
                              transform='rotate(45 1.45312 0.914062)'
                            />
                            <rect
                              x='8'
                              y='7.45703'
                              width='9.25346'
                              height='2.05632'
                              transform='rotate(135 8 7.45703)'
                            />
                          </svg>
                        </span>
                      </Link> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback if no discounts are available */}
        {/* {teamMembers.length === 0 && (
          <div className='my-5 text-center'>
            <p>No Active Offers</p>
          </div>
        )} */}

        {teamMembers.length === 0 && !apiError && (
          <div className='my-5 text-center'>
            <p>No Active Offers</p>
          </div>
        )}
      </div>

      {/* Popup for view details */}
      {showPopup && selectedMember && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            <h3>{selectedMember.name}</h3>
            <p>Designation: {selectedMember.designation}</p>
            <p>Department: {selectedMember.department}</p>
            <p>Description: {selectedMember.description}</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Offers;
