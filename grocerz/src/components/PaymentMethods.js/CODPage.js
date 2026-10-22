import React, { useState } from 'react';
//import { FaMoneyBillAlt } from "react-icons/fa";

const CODPage = () => {
  const [captcha, setCaptcha] = useState('');
  const [userInput, setUserInput] = useState('');

  const handleInputChange = event => {
    setUserInput(event.target.value);
  };

  const handlePlaceOrderClick = () => {
    const confirmed = window.confirm(
      'Are you sure you want to place the order?'
    );
    if (confirmed && userInput === captcha) {
      // Clear input
      setUserInput('');
      // Show success message
      alert('Order placed successfully!');
      // Generate new captcha
      generateCaptcha();
    } else if (!confirmed) {
      // Do nothing if the user cancels
      return;
    } else {
      // Show error message for invalid captcha
      alert('Invalid captcha. Please try again.');
    }
  };

  const generateCaptcha = () => {
    const randomCaptcha = Math.random().toString(36).substring(7).toUpperCase();
    setCaptcha(randomCaptcha);
  };

  useState(() => {
    generateCaptcha();
  }, []);

  return (
    <div className='cod-container'>
      <div className='cash-on-delivery-page'>
        <span className='payment-heading'>Cash on Delivery (Cash/UPI)</span>

        <div className='captcha-container'>
          <br />
          <p>Please enter the following captcha to proceed:</p>
          <div className='captcha'>
            <span>{captcha}</span>
            <button className='refresh-captcha' onClick={generateCaptcha}>
              Refresh
            </button>
          </div>
          <div className='input-container'>
            <input
              type='text'
              placeholder='Enter Captcha'
              value={userInput}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button className='place-order-btn' onClick={handlePlaceOrderClick}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CODPage;
