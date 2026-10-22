import React, { useState } from 'react';
import icici from '../icon-img/icici1.webp';
import freecharge from '../icon-img/freecharge.png';
import flipkart from '../icon-img/flipkart.png';
import lazypay from '../icon-img/Lazypay.png';
const PayLater = () => {
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleWalletClick = wallet => {
    setSelectedWallet(wallet);
  };

  const handleWalletSelection = event => {
    setSelectedWallet(event.target.id);
  };

  const handlePayLaterClick = () => {
    //console.log('Pay later button clicked for:', selectedWallet);
  };

  return (
    <div className='wallet-container'>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('iciciPayLater')}
      >
        <input
          className='check'
          type='radio'
          id='iciciPayLater'
          name='wallet'
          checked={selectedWallet === 'iciciPayLater'}
          readOnly
        />
        <img src={icici} alt='' className='payment-icon' />
        <label htmlFor='iciciPayLater'>ICICI Pay Later</label>
        {selectedWallet === 'iciciPayLater' && (
          <button className='place-order-btn' onClick={handlePayLaterClick}>
            Pay Now
          </button>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('freechargePayLater')}
      >
        <input
          className='check'
          type='radio'
          id='freechargePayLater'
          name='wallet'
          checked={selectedWallet === 'freechargePayLater'}
          readOnly
        />
        <img src={freecharge} alt='' className='payment-icon' />
        <label htmlFor='freechargePayLater'>Freecharge Pay Later</label>
        {selectedWallet === 'freechargePayLater' && (
          <button className='place-order-btn' onClick={handlePayLaterClick}>
            Pay Now
          </button>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('flipkartPayLater')}
      >
        <input
          className='check'
          type='radio'
          id='flipkartPayLater'
          name='wallet'
          checked={selectedWallet === 'flipkartPayLater'}
          readOnly
        />
        <img src={flipkart} alt='' className='payment-icon' />
        <label htmlFor='flipkartPayLater'>Flipkart Pay Later</label>
        {selectedWallet === 'flipkartPayLater' && (
          <button className='place-order-btn' onClick={handlePayLaterClick}>
            Pay Now
          </button>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('lazyPayLater')}
      >
        <input
          className='check'
          type='radio'
          id='lazyPayLater'
          name='wallet'
          checked={selectedWallet === 'lazyPayLater'}
          readOnly
        />
        <img src={lazypay} alt='' className='payment-icon' />
        <label htmlFor='lazyPayLater'>Lazypay</label>
        {selectedWallet === 'lazyPayLater' && (
          <button className='place-order-btn' onClick={handlePayLaterClick}>
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};

export default PayLater;
