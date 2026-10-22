import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import DashboardRoutes from '../DashboardRoutes';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DataAppContext } from '../../DataContext';
import {  toast } from 'react-toastify';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function DeleteAccount() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userid = localStorage.getItem('userid');
  const navigate = useNavigate();
  const { appstate, logout_user } = useContext(DataAppContext);
  const url = `${process.env.REACT_APP_API_URL}users/deleteaccount`;
  const [showPassword, setshowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setshowPassword(!showPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        url,
        {
          username: username,
          password: password,
        }
      );

      if (response.status === 200) {
        toast.success('Your account has been deleted successfully');
        setTimeout(() => {
          logout_user();
          navigate('/');
        }, 3000);
      } else if (response.status == 400 || response.status == 401) {
        toast.error("User not found or already deleted")
      }
    } catch (error) {
      console.error('Error changing password', error);
      toast.error(error.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <section className="blog about-blog">
        <div className="container">

        </div>
      </section>

      <section className="user-profile footer-padding">
        <div className="container">
          <div className="user-profile-section box-shadows">
            <div className="user-dashboard">
              {userid && <DashboardRoutes />}
              <div className="container mx-auto max-w-md my-3 mb-4 my-5 mt-8">
                <h2 className="text-xl font-semibold mb-4">Delete Your Account</h2>
                <p className="text-base text-gray-600 mb-5">
                  Enter your username, email, or mobile number, along with your password to delete your account. Your account will be deleted after 30 days of deletion.
                </p>
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="form-section">
                      <form onSubmit={handleSubmit}>
                        <div className="password form-item">
                          <label
                            htmlFor="username"
                            className="form-label text-lg font-semibold h5"
                          >
                            Username, Email, or Mobile*
                          </label>
                          <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={e => setUserName(e.target.value)}
                            className="form-control text-lg p-3 h5"
                            placeholder="Enter your username, email, or mobile"
                            required
                          />
                        </div>

                        <div className="re-password form-item mt-4">
                          <label htmlFor="password" className="form-label text-lg font-semibold h5">
                            Password*
                          </label>
                          <div className="input-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="form-control text-lg p-3 h5"
                              placeholder="Enter your password"
                              required
                              style={{
                                height: "45px", 
                                borderTopRightRadius: "0",
                                borderBottomRightRadius: "0",
                              }}
                            />
                            <span
                              className="input-group-text d-flex align-items-center justify-content-center"
                              onClick={togglePasswordVisibility}
                              style={{
                                cursor: "pointer",
                                background: "#fff",
                                borderLeft: "1px solid #ccc",
                                borderTopRightRadius: "5px",
                                borderBottomRightRadius: "5px",
                                height: "45px",
                                padding: "0 5px", 
                              }}
                            >
                              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                          </div>
                        </div>


                        {errorMessage && <div class='error-message'>{errorMessage}</div>}
                        {successMessage && <div class='success-message'>{successMessage}</div>}
                        <div className="form-btn d-flex gap-2 mt-4">
                          <button
                            type="submit"
                            className="deactivate-account-btn text-lg p-3"
                            disabled={loading}
                          >
                            Delete Account
                          </button>
                          <Link
                            to="/dashboard"
                            className="shop-btn cancel-btn text-lg p-3"
                          >
                            Cancel
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Image section */}
                  <div className="col-lg-6">
                    <div className="reset-img text-end">
                      <img
                        src="assets/images/homepage-one/reset.webp"
                        alt="reset"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>

                {/* Informational Note */}
                <div className="mt-5 text-gray-600">
                  <p className="text-sm">
                    By deleting your account, you agree that your account will be permanently deleted after 30 days. If you change your mind, simply log in within this period to restore your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>

  );
}

export default DeleteAccount;
