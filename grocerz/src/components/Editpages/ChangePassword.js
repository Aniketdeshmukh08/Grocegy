import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import DashboardRoutes from '../DashboardRoutes';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);

  const [oldPasswordShow, setOldPasswordShow] = useState(false);
  const [newPasswordShow, setNewPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

  const handleOldPassswordShow = () => setOldPasswordShow(!oldPasswordShow);
  const handleNewPasswordShow = () => setNewPasswordShow(!newPasswordShow);
  const handleConfirmPasswordShow = () => setConfirmPasswordShow(!confirmPasswordShow);

  const navigate = useNavigate();

  const url = `${process.env.REACT_APP_API_URL}users/updateuserpassword`;

  const handleSubmit = async e => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and Confirm password don't match");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const userid = localStorage.getItem('userid');

      const response = await axios.put(
        url,
        {
          userid: userid,
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setErrorMessage('');
        setSuccessMessage('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error changing password', error);
      if (error.response && error.response.status === 401) {
        setErrorMessage('Old password is incorrect.');
      } else if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setErrorMessage('Network error occurred. Please try again later.');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Password</h1>
          </div>
        </div>
      </section>
      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />
              <div className='container mx-auto max-w-md my-3 mb-4 my-5 mt-8'>
                <h2 className='text-xl font-semibold mb-4'>Change Password</h2>
                <div className='row align-items-center'>
                  <div className='col-lg-6'>
                    <div className='form-section'>
                      <form onSubmit={handleSubmit}>
                        <div className="form-item position-relative">
                          <label
                            htmlFor="oldPassword"
                            className="form-label input-lg text-lg font-semibold h5"
                          >

                            Old Password*
                          </label>
                          <input
                            type={oldPasswordShow ? "text" : "password"}
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="form-control text-lg p-3 h5"
                            placeholder="******"
                            required
                          />
                          <button
                            className='position-absolute top-50 end-0 me-3'
                            onClick={handleOldPassswordShow}
                            style={{ cursor: "pointer" }}
                          >{oldPasswordShow ? <FaEyeSlash size={18} /> : <FaEye size={18} />}</button>
                        </div>
                        <div className='password form-item position-relative'>
                          <label
                            htmlFor='newPassword'
                            className='form-label text-lg font-semibold h5'
                          >
                            New Password*
                          </label>
                          <input
                            type={newPasswordShow ? 'text' : 'password'}
                            id='newPassword'
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className='form-control text-lg p-3 h5'
                            placeholder='******'
                            required
                          />
                          <button
                            onClick={handleNewPasswordShow}
                            className='position-absolute top-50 end-0 me-3'
                            style={{ cursor: "pointer" }}

                          >{newPasswordShow ? <FaEyeSlash size={18} /> : <FaEye size={18} />}</button>
                        </div>
                        <div className='re-password form-item position-relative'>
                          <label
                            htmlFor='confirmPassword'
                            className='form-label text-lg font-semibold h5'
                          >
                            Re-enter Password*
                          </label>
                          <input
                            type={confirmPasswordShow ? 'text' : 'password'}
                            id='confirmPassword'
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className='form-control text-lg p-3 h5'
                            placeholder='******'
                            required
                          />
                          <button
                            onClick={handleConfirmPasswordShow}
                               className='position-absolute top-50 end-0 me-3'
                            style={{ cursor: "pointer" }}
                          >{confirmPasswordShow ? <FaEyeSlash size={18} /> : <FaEye size={18} />} </button>

                        </div>
                        {/* <div className='show-password-checkbox d-flex mt-2 gap-2'>
                          <input
                            type='checkbox'
                            id='showPassword'
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                          />
                          <label
                            htmlFor='showPassword'
                            className='form-label text-lg mt-2'
                          >
                            Show Passwords
                          </label>
                        </div> */}
                        {errorMessage && (
                          <div className='text-danger mb-4 text-lg'>
                            {errorMessage}
                          </div>
                        )}
                        {successMessage && (
                          <div className='text-success mb-4 text-lg'>
                            {successMessage}
                          </div>
                        )}
                        <div className='form-btn d-flex gap-2 mt-4'>
                          <button
                            type='submit'
                            className='shop-btn text-lg p-3'
                            disabled={loading}
                          >
                            {loading ? 'Updating...' : 'Update Password'}
                          </button>
                          <Link
                            to='/dashboard'
                            className='shop-btn cancel-btn text-lg p-3'
                          >
                            Cancel
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <div className='reset-img text-end'>
                      <img
                        src='assets/images/homepage-one/reset.webp'
                        alt='reset'
                      />
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
}

export default ChangePasswordPage;
