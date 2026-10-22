import React, { useState } from 'react';
import axios from 'axios';
import { ConfirmationModal } from './shared/ConfirmationModal';

const GuestAddess = ({
  formData,
  setFormData,
  error,
  setError,
  handleSubmit,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

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
      <form onSubmit={handleSubmit} className='checkout__form'>
        <div className='row review-form'>
          <div className='col-lg-12'>
            <div className='checkout__form__input width-100'>
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
          </div>
          <div className='col-lg-12'>
            <div className='checkout__form__input width-100'>
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
          </div>
          <div className='col-lg-12'>
            <div className='checkout__form__input width-100'>
              <p>Landmark</p>
              <input
                type='text'
                name='landmark'
                value={formData.landmark}
                onChange={handleChange}
                className='form-control'
              />
            </div>
          </div>
          <div className='col-lg-6'>
            <div className='checkout__form__input width-100'>
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
          </div>
          <div className='col-lg-6'>
            <div className='checkout__form__input width-100'>
              <p>
                City <span>*</span>
              </p>
              <input
                type='text'
                name='city'
                value={formData.city || ''}
                onChange={handleChange}
                className='form-control'
                placeholder='City'
                disabled
                style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
              />
            </div>
          </div>
          <div className='col-lg-6'>
            <div className='checkout__form__input width-100'>
              <p>
                State <span>*</span>
              </p>
              <input
                type='text'
                name='state'
                value={formData.state || ''}
                onChange={handleChange}
                className='form-control'
                placeholder='State'
                disabled
                style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
              />
            </div>
          </div>
          <div className='col-lg-6'>
            <div className='checkout__form__input width-100'>
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
          </div>
          <div className='col-lg-6'>
            <div className='checkout__form__input width-100'>
              <p>Alternate Contact</p>
              <input
                type='text'
                name='alternatecontact'
                value={formData.alternatecontact}
                onChange={handleChange}
                className='form-control '
              />
            </div>
          </div>
        </div>

        {error && (
          <div class='alert alert-danger my-4  text-custom-font-1' role='alert'>
            {error}
          </div>
        )}
      </form>

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
export default GuestAddess; 