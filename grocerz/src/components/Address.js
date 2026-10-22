import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import loaderGif from '../assets/images/loader.gif';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from './shared/ConfirmationModal';
const Address = () => {
  const userid = localStorage.getItem('userid');
  const [formData, setFormData] = useState({
    userid: userid,
    addressid: '',
    name: '',
    line1: '',
    line2: '',
    line3: '',
    city: '',
    state: '',
    country: '',
    pin: '',
    contact: '',
    alternatecontact: '',
    landmark: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'alternatecontact' && value !== '' && !/^\d*$/.test(value)) {
      setModalMessage('Alternate contact numbers must be 10-digit numbers.');
      setShowModal(true);
      return;
    } else {
      setFormError('');
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Check if mandatory fields are empty
    if (
      formData.name.trim() === '' ||
      formData.line1.trim() === '' ||
      formData.city.trim() === '' ||
      formData.state.trim() === '' ||
      formData.country.trim() === '' ||
      formData.pin.trim() === '' ||
      formData.contact.trim() === ''
    ) {
      setModalMessage('Please fill in all mandatory fields.');
      setShowModal(true);
      return;
    }

    // Check if pin code is a number
    if (isNaN(formData.pin.trim())) {
      setModalMessage('Pin code must be a number.');
      setShowModal(true);
      return;
    }

    // Check if contact numbers are 10 digits
    if (
      !/^\d{10}$/.test(formData.contact.trim())
      //!/^\d{10}$/.test(formData.alternatecontact.trim())
    ) {
      setModalMessage('Contact numbers must be 10-digit numbers.');
      setShowModal(true);
      return;
    }

    if (formData.alternatecontact.trim() !== '' && !/^\d{10}$/.test(formData.alternatecontact.trim())) {
      setModalMessage('Alternate contact numbers must be 10-digit numbers.');
      setShowModal(true);
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmission = async () => {
    setLoading(true);
    try {
      // Make POST request to the API endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}address/addAddress`,
        formData
      );
      //console.log('API response:', response.data);
      // Clear the form data
      setFormData({
        userid: userid,
        addressid: '',
        name: '',
        line1: '',
        line2: '',
        line3: '',
        city: '',
        state: '',
        country: '',
        pin: '',
        contact: '',
        alternatecontact: '',
        landmark: '',
      });
      navigate('/address');
      // Handle success, maybe redirect user or show a success message
    } catch (error) {
      console.error('API error:', error);
      setModalMessage('Something went wrong. Please try again later.');
      setShowModal(true);
      // Handle error, maybe show an error message to the user
    }
    setLoading(false);
    setShowConfirmationModal(false);
  };

  const handleCancelSubmission = () => {
    setShowConfirmationModal(false);
  }
  const fillpindetails = async () => {
    if (!formData.pin || formData.pin.trim() === '') return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}pincodes/check/${formData.pin}`);
      if (response.data.success) {
        setError('');
        setFormData(prevState => ({
          ...prevState,
          city: response.data.data.city,
          state: response.data.data.state,
          country: response.data.data.country || 'India',
        }));
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setModalMessage(err.response.data.message || 'Sorry! We do not serve in this area.');
      } else {
        setModalMessage('Error verifying pincode. Please try again.');
      }
      setShowModal(true);
      setError('');
      setFormData(prevState => ({
        ...prevState,
        city: '',
        state: '',
        country: '',
      }));
    }
  };

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
                              <div className='container'>
                                <div className='row'>
                                  <div className='col-lg-12'>
                                    {loading ? (
                                      <div className='loader-div'>
                                        <img className='loader-img'
                                          src={loaderGif}
                                          alt='Loading...' />
                                      </div>
                                    ) : (
                                      <form
                                        onSubmit={handleSubmit}
                                        className='checkout__form'
                                      >
                                        <div className='row'>
                                          <div className='col-lg-12'>
                                            <Link
                                              to='/address'
                                              class='shop-btn'
                                            >
                                              Back to Addresses
                                            </Link>
                                            <h5>Add New Address</h5>
                                            <div className='row'>
                                              {/* <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="checkout__form__input">
                          <p>User ID <span>*</span></p>
                          <input type="text" name="userid" value={formData.userid} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="checkout__form__input">
                          <p>Address ID <span>*</span></p>
                          <input type="text" name="addressid" value={formData.addressid} onChange={handleChange} />
                        </div>
                      </div> */}
                                              <div className='col-lg-12 review-form'>
                                                <div className='checkout__form__input'>
                                                  <p>
                                                    Name <span>*</span>
                                                  </p>
                                                  <input
                                                    type='text'
                                                    name='name'
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className='form-control'
                                                  />
                                                </div>
                                                <div className='checkout__form__input'>
                                                  <p>
                                                    Address<span>*</span>
                                                  </p>
                                                  <input
                                                    type='text'
                                                    name='line1'
                                                    value={formData.line1}
                                                    onChange={handleChange}
                                                    className='form-control'
                                                  />
                                                </div>

                                                <div className='checkout__form__input'>
                                                  <p>Landmark</p>
                                                  <input
                                                    type='text'
                                                    name='landmark'
                                                    value={formData.landmark}
                                                    onChange={handleChange}
                                                    className='form-control'
                                                  />
                                                </div>

                                                {/* <div className="checkout__form__input">
                                                <p>Address Line 2</p>
                                                <input type="text" name="line2" value={formData.line2} onChange={handleChange} className="form-control" />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Address Line 3</p>
                                                <input type="text" name="line3" value={formData.line3} onChange={handleChange} className="form-control" />
                                              </div> */}

                                                <div className='checkout__form__input'>
                                                  <p>
                                                    Pin <span>*</span>
                                                  </p>
                                                  <input
                                                    type='text'
                                                    name='pin'
                                                    value={formData.pin}
                                                    onChange={handleChange}
                                                    onBlur={fillpindetails}
                                                    className='form-control'
                                                  />
                                                </div>

                                                <div className='checkout__form__input'>
                                                  <p>
                                                    City <span>*</span>
                                                  </p>
                                                  <input
                                                    type='text'
                                                    name='city'
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className='form-control'
                                                    disabled
                                                  />
                                                </div>
                                                <div className='checkout__form__input'>
                                                  <p>
                                                    State <span>*</span>
                                                  </p>
                                                  <input
                                                    type='text'
                                                    name='state'
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    className='form-control'
                                                    disabled
                                                  />
                                                </div>
                                                <div className='checkout__form__input'>
                                                  <p>
                                                    Country <span>*</span>
                                                  </p>
                                                  <input
                                                    type='text'
                                                    name='country'
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    className='form-control'
                                                    disabled
                                                  />
                                                </div>

                                                <div className='checkout__form__input'>
                                                  <p>
                                                    Contact <span>*</span>
                                                  </p>
                                                  <input
                                                    type='text'
                                                    name='contact'
                                                    value={formData.contact}
                                                    onChange={handleChange}
                                                    className='form-control'
                                                  />
                                                </div>
                                                <div className='checkout__form__input'>
                                                  <p>Alternate Contact</p>
                                                  <input
                                                    type='text'
                                                    name='alternatecontact'
                                                    value={
                                                      formData.alternatecontact
                                                    }
                                                    onChange={handleChange}
                                                    className='form-control'
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {error && (
                                          <div
                                            class='alert alert-danger'
                                            role='alert'
                                          >
                                            {error}
                                          </div>
                                        )}
                                        <button
                                          type='submit'
                                          class='shop-btn'
                                          disabled={error}
                                        >
                                          Add Address
                                        </button>
                                      </form>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showConfirmationModal && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            <h3>Are you sure you want to add this address</h3>
            <button onClick={handleCancelSubmission}>Cancel</button>
            <button onClick={handleConfirmSubmission}>Confirm</button>
          </div>
        </div>
      )}

      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Notification"
        modalMessage={modalMessage}
        wantToAddData={true}
        confirmation={() => setShowModal(false)}
        operationType="Close"
        hideCancel={true}
      />
    </>
  );
};

export default Address;
