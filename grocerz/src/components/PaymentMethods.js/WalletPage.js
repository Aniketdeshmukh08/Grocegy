import React, { useState } from 'react';
import freecharge from '../icon-img/freecharge.png';
import mobikwik from '../icon-img/mobikwik.png';
import airtelbank from '../icon-img/airtel.png';
import olamoney from '../icon-img/olamoney.png';
import amazonpay from '../icon-img/amazonpay.png';
const WalletComponent = () => {
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
        onClick={() => handleWalletClick('freecharge')}
      >
        <input
          className='check'
          type='radio'
          id='freecharge'
          name='wallet'
          checked={selectedWallet === 'freecharge'}
          readOnly
        />
        <img src={freecharge} alt='' className='payment-icon' />
        <label htmlFor='freecharge'>Freecharge (Wallet and Pay later)</label>
        {selectedWallet === 'freecharge' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('mobikwik')}
      >
        <input
          className='check'
          type='radio'
          id='mobikwik'
          name='wallet'
          checked={selectedWallet === 'mobikwik'}
          readOnly
        />
        <img src={mobikwik} alt='' className='payment-icon' />
        <label htmlFor='mobikwik'>Mobikwik | ZIP (Pay Later)</label>
        {selectedWallet === 'mobikwik' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
      <div className='payment-method' onClick={() => handleWalletClick('ola')}>
        <input
          className='check'
          type='radio'
          id='ola'
          name='wallet'
          checked={selectedWallet === 'ola'}
          readOnly
        />
        <img src={olamoney} alt='' className='payment-icon' />
        <label htmlFor='ola'>OLA Money</label>
        {selectedWallet === 'ola' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
      <div
        className='payment-method'
        onClick={() => handleWalletClick('airtelPaymentsBank')}
      >
        <input
          className='check'
          type='radio'
          id='airtelPaymentsBank'
          name='wallet'
          onChange={handleWalletSelection}
        />
        <img src={airtelbank} alt='' className='payment-icon' />
        <span>Airtel Payments Bank</span>
        {selectedWallet === 'airtelPaymentsBank' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>

      <div
        className='payment-method'
        onClick={() => handleWalletClick('amazonPay')}
      >
        <input
          className='check'
          type='radio'
          id='amazonPay'
          name='wallet'
          onChange={handleWalletSelection}
        />
        <img src={amazonpay} alt='' className='payment-icon' />
        <span>Amazon Pay</span>
        {selectedWallet === 'amazonPay' && (
          <button className='place-order-btn' onClick={handlePayNowClick}>
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletComponent;
