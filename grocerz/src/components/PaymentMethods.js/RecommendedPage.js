import React, { useState, useEffect } from 'react';
import { FaMoneyBillAlt } from 'react-icons/fa';
import upiicon from '../icon-img/upi.svg';
import phonepeicon from '../icon-img/phonepe-logo-icon (1).svg';

const RecommendedPage = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [captcha, setCaptcha] = useState('');
  const [userInput, setUserInput] = useState('');

  const handlePaymentMethodClick = method => {
    setSelectedMethod(method);
  };

  const handleInputChange = event => {
    setUserInput(event.target.value);
  };

  const generateCaptcha = () => {
    const randomCaptcha = Math.random().toString(36).substring(7).toUpperCase();
    setCaptcha(randomCaptcha);
  };

  // Function to handle refresh captcha button click
  const handleRefreshCaptchaClick = () => {
    generateCaptcha();
  };

  // Function to handle place order button click
  const handlePlaceOrderClick = () => {
    // Logic to verify captcha
    if (userInput === captcha) {
      // Place order logic
      alert('Order placed successfully!');
    } else {
      // Invalid captcha
      alert('Invalid captcha. Please try again.');
      // Clear the input field
      setUserInput('');
      // Focus the input field
      document.getElementById('captchaInput').focus();
    }
  };

  // Generate captcha when component mounts
  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className='recommended-container'>
      <div
        className='payment-method'
        onClick={() => handlePaymentMethodClick('cash')}
      >
        <input
          type='radio'
          className='check'
          checked={selectedMethod === 'cash'}
          readOnly
        />
        <FaMoneyBillAlt className='payment-icon' />
        <span>Cash on Delivery (Cash/UPI)</span>
        {selectedMethod === 'cash' && (
          <>
            <div className='payment-details'>
              <p>Please enter the following captcha to proceed:</p>
              <div className='captcha'>
                <span>{captcha}</span>
                <button
                  className='refresh-captcha'
                  onClick={handleRefreshCaptchaClick}
                >
                  Refresh
                </button>
              </div>
              <input
                id='captchaInput'
                className='input-container'
                type='text'
                placeholder='Enter Captcha'
                value={userInput}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <button
                className='place-order-btn'
                onClick={handlePlaceOrderClick}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handlePaymentMethodClick('googlePay')}
      >
        <input
          type='radio'
          className='check'
          checked={selectedMethod === 'googlePay'}
          readOnly
        />
        <img src={upiicon} alt='' className='payment-icon' />
        <span>GooglePay</span>
        {selectedMethod === 'googlePay' && (
          <>
            <div className='payment-details'>
              <input type='text' placeholder='Enter UPI ID' />
              <button className='place-order-btn'>Pay Now</button>
            </div>
          </>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handlePaymentMethodClick('phonePe')}
      >
        <input
          type='radio'
          className='check'
          checked={selectedMethod === 'phonePe'}
          readOnly
        />
        <img src={phonepeicon} alt='' className='payment-icon' />
        <span>PhonePe</span>
        {selectedMethod === 'phonePe' && (
          <>
            <div className='payment-details'>
              <input type='text' placeholder='Enter PhonePe ID' />
              <button className='place-order-btn'>Pay Now</button>
            </div>
          </>
        )}
      </div>
      {/* Include other payment method items here */}
    </div>
  );
};

export default RecommendedPage;
