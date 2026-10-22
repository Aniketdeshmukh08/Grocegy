import React, { useState } from 'react';
import { FaGooglePay, FaPhone } from 'react-icons/fa';
import upiicon from '../icon-img/upi.svg';
import phonepeicon from '../icon-img/phonepe-logo-icon (1).svg';

const UpiPaymentOptions = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handlePaymentMethodClick = method => {
    setSelectedMethod(method);
  };

  return (
    <div className='upi-container'>
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
          <div className='payment-details'>
            <button className='place-order-btn'>Pay Now</button>
          </div>
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
        <FaGooglePay className='payment-icon' />
        <span>Google Pay</span>

        {selectedMethod === 'googlePay' && (
          <div className='payment-details'>
            <input type='text' placeholder='Enter UPI ID' />
            <button className='place-order-btn'>Pay Now</button>
          </div>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handlePaymentMethodClick('enterUPI')}
      >
        <input
          type='radio'
          className='check'
          checked={selectedMethod === 'enterUPI'}
          readOnly
        />
        <img src={upiicon} alt='' className='payment-icon' />
        <span>Enter UPI ID</span>
        {selectedMethod === 'enterUPI' && (
          <div className='payment-details'>
            <input type='text' placeholder='Enter UPI ID' />
            <button className='place-order-btn'>Pay Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpiPaymentOptions;
