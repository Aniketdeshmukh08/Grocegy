import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    userid: '',
    name: '',
    email: '',
    mobile: '',
    username: '',
  });
  const userId = window.localStorage.getItem('userid');

  const callApiQsList = async () => {
    try {
      const url =
        process.env.REACT_APP_API_URL + 'profile/findstudent/' + userId;

      const response = await axios.get(url);
      console.log(response.data);
      setUserDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callApiQsList();
  }, []);

  return (
    <div>
      <div className='row'>
        <div className='col-sm-12 col-lg-12'>
          <div className='card text-white bg-flat-color-2'>
            <div className='card-body'>
              <div className='card-left pt-1 float-left'>
                <h3 className='mb-0 fw-r'>
                  <span className='currency float-left mr-1'>
                    {userDetails.name}
                  </span>
                </h3>
                <br></br>
                <p className='text-light mt-1 m-0'>Name: {userDetails.name}</p>
                <p className='text-light mt-1 m-0'>
                  Username: {userDetails.username}
                </p>
                <p className='text-light mt-1 m-0'>
                  Email: {userDetails.email}
                </p>
                <p className='text-light mt-1 m-0'>
                  Mobile: {userDetails.mobile}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-sm-12 col-lg-12'>
          <Link to='/dashboard' className='link-success'>
            <div className='card text-white bg-flat-color-1'>
              <div className='card-body'>
                <div className='card-left pt-1 float-left'>
                  <h3 className='mb-0 fw-r'>
                    <span className='currency float-left mr-1'>Dashboard</span>
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
