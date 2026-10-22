import React, { useState } from 'react';
import hdfc from '../icon-img/hdfcbank.png';
import icici from '../icon-img/icici1.webp';
import axis from '../icon-img/axis1.png';
const EmiPage = () => {
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
    <div className='wallet-container'>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('hdfccredit')}
      >
        <input
          className='check'
          type='radio'
          id='hdfccredit'
          name='wallet'
          checked={selectedWallet === 'hdfccredit'}
          readOnly
        />
        <img src={hdfc} alt='' className='payment-icon' />
        <label htmlFor='hdfccredit'>HDFC Credit Card EMI</label>
        {selectedWallet === 'hdfccredit' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('hdfcdebit')}
      >
        <input
          className='check'
          type='radio'
          id='hdfcdebit'
          name='wallet'
          checked={selectedWallet === 'hdfcdebit'}
          readOnly
        />
        <img src={hdfc} alt='' className='payment-icon' />
        <label htmlFor='hdfcdebit'>HDFC Debit Card EMI</label>
        {selectedWallet === 'hdfcdebit' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>

      <div
        className='payment-method'
        onClick={() => handleWalletClick('icicicredit')}
      >
        <input
          className='check'
          type='radio'
          id='icicicredit'
          name='wallet'
          checked={selectedWallet === 'icicicredit'}
          readOnly
        />
        <img src={icici} alt='' className='payment-icon' />
        <label htmlFor='icicicredit'>ICICI Credit Card EMI</label>
        {selectedWallet === 'icicicredit' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('icicidebit')}
      >
        <input
          className='check'
          type='radio'
          id='icicidebit'
          name='wallet'
          checked={selectedWallet === 'icicidebit'}
          readOnly
        />
        <img src={icici} alt='' className='payment-icon' />
        <label htmlFor='icicidebit'>ICICI Debit Card EMI</label>
        {selectedWallet === 'icicidebit' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('axiscredit')}
      >
        <input
          className='check'
          type='radio'
          id='axiscredit'
          name='wallet'
          checked={selectedWallet === 'axiscredit'}
          readOnly
        />
        <img src={axis} alt='' className='payment-icon' />
        <label htmlFor='axiscredit'>AXIS Credit Card EMI</label>
        {selectedWallet === 'axiscredit' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};

export default EmiPage;
