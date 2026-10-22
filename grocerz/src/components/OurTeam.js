import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  toast } from 'react-toastify';
import axios from 'axios';
import loaderGif from '../assets/images/loader.gif';

const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const url = `${process.env.REACT_APP_API_URL}ourteam`;
        const response = await axios.get(url);
        setTeamMembers(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching team members.');
        console.error(error);
        setLoading(false);
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
            <span>Our Team</span>
          </div> */}
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Meet Our Team</h1>
          </div>
        </div>
      </section>

      

      <div className='container'>

        {loading && (
          <div className='loader-div'>
          <img className='loader-img'
            src={loaderGif}
            alt='Loading...'/>
        </div>
        )}
        {!loading && (
          <div className='row d-flex flex-wrap'>
            {teamMembers.length > 0 ? (
              teamMembers.map((member, index) => (
                <div
                  className='col-lg-3 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch'
                  key={member.id}
                >
                  <div
                    className='product-wrapper m-2 w-100 d-flex flex-column'
                    data-aos='fade-up'
                  >
                    <Link to={`/team/${member.id}`}>
                      <div className='product-img'>
                        <img
                          src={
                            member.image
                              ? `${process.env.REACT_APP_API_URL}${member.image}`
                              : 'default-image.jpg'
                          }
                          alt={member.name}
                        />
                      </div>
                    </Link>
                    <div className='product-info flex-grow-1'>
                      <div className='product-description'>
                        <div className='product-details fs-2'>{member.name}</div>
                        <div className='price'>
                          <span className='designation fs-2  text-success'>
                             {member.designation}
                          </span>
                        </div>
                      </div>
                      <div className='product-cart-btn mt-5'>
                        <button
                          onClick={() => handleViewDetails(member)}
                          className='product-btn'
                          type='button'
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No team members found.</p>
            )}
          </div>
        )}
      </div>

      {showPopup && selectedMember && (
        <div className='popup-overlay'>
          <div className='popup-content d-flex gap-5'>
          
            <div className="product-img flex-shrink-0 col-4">

                <img
                  src={
                    selectedMember.image
                      ? `${process.env.REACT_APP_API_URL}${selectedMember.image}`
                      : 'default-image.jpg'
                  }
                  alt={selectedMember.name}
                />
              </div>

               {/* Details Section */}
              <div className="flex-grow-1 col-8">
                <h3 id="popup-title" className="mb-3">{selectedMember.name}</h3>
                
                <div className="d-flex">
                  <p className="fw-bold me-2 mb-2">Designation:</p>
                  <p className="mb-1">{selectedMember.designation}</p>
                </div>

                <div className="d-flex">
                  <p className="fw-bold me-2 mb-2">Department:</p>
                  <p className="mb-1">{selectedMember.department}</p>
                </div>

                <div className="w-100 text-start">
                  <p className="fw-bold mb-1 d-inline">Description : </p>
                  <p className="mb-0 d-inline">
                    {selectedMember.description}
                  </p>
                </div>

                <button onClick={handleClosePopup}>Close</button>
              </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OurTeam;
