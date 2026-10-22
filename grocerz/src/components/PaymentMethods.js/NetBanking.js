import React, { useState } from 'react';
import hdfc from '../icon-img/hdfcbank.png';
import icici from '../icon-img/icici1.webp';
import axis from '../icon-img/axis1.png';
import sbi from '../icon-img/sbibank.webp';
import kotak from '../icon-img/kotak.png';
const NetBanking = () => {
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Function to handle click on a wallet option
  const handleWalletClick = wallet => {
    setSelectedWallet(wallet);
  };
  const handleWalletSelection = event => {
    setSelectedWallet(event.target.id);
  };
  // Function to handle pay now button click
  const handlePayNowClick = () => {
    // Logic for pay now button click
    //console.log('Pay now button clicked for:', selectedWallet);
  };

  return (
    <div className='bank-container'>
      <div className='payment-method' onClick={() => handleWalletClick('hdfc')}>
        <input
          className='check'
          type='radio'
          id='hdfc'
          name='bank'
          checked={selectedWallet === 'hdfc'}
          readOnly
        />
        <img src={hdfc} alt='' className='payment-icon' />
        <label htmlFor='hdfc'>HDFC Bank </label>
        {selectedWallet === 'hdfc' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
      <div className='payment-method' onClick={() => handleWalletClick('Sbi')}>
        <input
          className='check'
          type='radio'
          id='Sbi'
          name='bank'
          checked={selectedWallet === 'Sbi'}
          readOnly
        />
        <img src={sbi} alt='' className='payment-icon' />
        <label htmlFor='Sbi'>SBI </label>
        {selectedWallet === 'Sbi' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>

      <div
        className='payment-method'
        onClick={() => handleWalletClick('icici')}
      >
        <input
          className='check'
          type='radio'
          id='icici'
          name='bank'
          checked={selectedWallet === 'icici'}
          readOnly
        />
        <img src={icici} alt='' className='payment-icon' />
        <label htmlFor='icici'>ICICI Bank</label>
        {selectedWallet === 'icici' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('kotak')}
      >
        <input
          className='check'
          type='radio'
          id='kotak'
          name='bank'
          checked={selectedWallet === 'kotak'}
          readOnly
        />
        <img src={kotak} alt='' className='payment-icon' />
        <label htmlFor='kotak'>Kotak Bank</label>
        {selectedWallet === 'kotak' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
      <div className='payment-method' onClick={() => handleWalletClick('axis')}>
        <input
          className='check'
          type='radio'
          id='axis'
          name='bank'
          checked={selectedWallet === 'axis'}
          readOnly
        />
        <img src={axis} alt='' className='payment-icon' />
        <label htmlFor='axis'>AXIS Bank</label>
        {selectedWallet === 'axis' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};

export default NetBanking;
