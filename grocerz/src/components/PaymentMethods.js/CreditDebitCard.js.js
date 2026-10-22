import React from 'react';
import { FaCreditCard } from 'react-icons/fa';

const CreditDebitCard = () => {
  return (
    <div className='credit'>
      <div className='credit-debit-item'>
        <span className='credit-debit-heading'>Credit / Debit Card</span>
      </div>
      <p className='credit-debit-info'>
        Please ensure your card can be used for online transactions.
      </p>
      <p className='credit-debit-know-more'>Know more</p>
      <div className='credit-debit-item'>
        <input
          type='text'
          className='credit-debit-input'
          placeholder='Card Number'
        />
        <FaCreditCard className='credit-debit-icon' />
      </div>
      <div className='credit-debit-item'>
        <input
          type='text'
          className='credit-debit-input'
          placeholder='Card Name'
        />
      </div>
      <div className='credit-debit-item'>
        <div className='credit-debit-input-container'>
          <input
            type='text'
            className='credit-debit-input'
            placeholder='Valid Thru (MM/YY)'
          />
          <input
            type='text'
            className='credit-debit-input credit-debit-cvv-input'
            placeholder='CVV'
          />
        </div>
      </div>

      <div className='credit-debit-item'>
        <button className='credit-debit-pay-now-btn'>Pay Now</button>
      </div>
    </div>
  );
};

export default CreditDebitCard;
