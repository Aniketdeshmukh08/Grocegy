import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMoneyBillAlt,
  FaCreditCard,
  FaWallet,
  FaRegCreditCard,
  FaMoneyCheckAlt,
  FaRegClock,
  FaUniversity,
} from 'react-icons/fa';
import staricon from '../components/icon-img/star.svg';
import upiicon from '../components/icon-img/upi.svg';
import visa from '../components/icon-img/visa.webp';
import mastercard from '../components/icon-img/mastercard.webp';
import paypal from '../components/icon-img/paypal.png';
import rupay from '../components/icon-img/rupay.png';
import EmiPage from './PaymentMethods.js/EmiPage';
import RecommendedPage from './PaymentMethods.js/RecommendedPage';
import CODPage from './PaymentMethods.js/CODPage';
import GPayBHIMUPI from './PaymentMethods.js/GPayBHIMUPI';
import CreditDebitCard from './PaymentMethods.js/CreditDebitCard.js';
import WalletPage from './PaymentMethods.js/WalletPage.js';
import PayLater from './PaymentMethods.js/PayLater.js';
import NetBanking from './PaymentMethods.js/NetBanking.js';
function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedPaymentPage, setSelectedPaymentPage] = useState(null);

  const handlePaymentMethodClick = id => {
    setSelectedPaymentMethod(id);

    switch (id) {
      case 'recommended':
        setSelectedPaymentPage(<RecommendedPage />);
        break;
      case 'cash':
        setSelectedPaymentPage(<CODPage />);
        break;
      case 'upi':
        setSelectedPaymentPage(<GPayBHIMUPI />);
        break;
      case 'creditcard':
        setSelectedPaymentPage(<CreditDebitCard />);
        break;
      case 'wallet':
        setSelectedPaymentPage(<WalletPage />);
        break;
      case 'paylater':
        setSelectedPaymentPage(<PayLater />);
        break;
      case 'emi':
        setSelectedPaymentPage(<EmiPage />);
        break;
      case 'netbanking':
        setSelectedPaymentPage(<NetBanking />);
        break;
      default:
        setSelectedPaymentPage(null);
        break;
    }
  };

  useEffect(() => {
    setSelectedPaymentMethod('recommended');
    setSelectedPaymentPage(<RecommendedPage />);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className='breadcrumb-option'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <div className='breadcrumb__links'>
                <Link to='index-2.html'>
                  <i className='fa fa-home'></i> Home
                </Link>
                <Link to='/checkout'>Shopping Cart</Link>
                <span>Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className='checkout spad'>
        <div className='container'>
          <div className='head'>
            <h5 className='payment-heading'>Choose Payment Mode</h5>
          </div>
          <div className='row'>
            <div className='col-lg-3'>
              <div className='payment-container rec'>
                <div
                  className={`payment-item ${selectedPaymentMethod === 'recommended' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodClick('recommended')}
                >
                  <img src={staricon} alt='' className='payment-icon' />
                  <span className='recommended'>Recommended</span>
                </div>
                <div
                  className={`payment-item ${selectedPaymentMethod === 'cash' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodClick('cash')}
                >
                  <FaMoneyBillAlt className='payment-icon' />
                  <span>Cash on Delivery (Cash/UPI)</span>
                </div>
                <div
                  className={`payment-item ${selectedPaymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodClick('upi')}
                >
                  <img src={upiicon} alt='' className='payment-icon ' />
                  <span>GooglePay/PhonePe/BHIM UPI</span>
                </div>
                <div
                  className={`payment-item ${selectedPaymentMethod === 'creditcard' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodClick('creditcard')}
                >
                  <FaCreditCard className='payment-icon' />
                  <span>Credit/Debit Card</span>
                </div>
                <div
                  className={`payment-item ${selectedPaymentMethod === 'wallet' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodClick('wallet')}
                >
                  <FaWallet className='payment-icon' />
                  <span>Wallet</span>
                </div>
                <div
                  className={`payment-item ${selectedPaymentMethod === 'paylater' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodClick('paylater')}
                >
                  <FaMoneyCheckAlt className='payment-icon' />
                  <span>Pay Later</span>
                </div>
                <div
                  className={`payment-item ${selectedPaymentMethod === 'emi' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodClick('emi')}
                >
                  <FaRegClock className='payment-icon' />
                  <span>EMI</span>
                </div>
                <div
                  className={`payment-item ${selectedPaymentMethod === 'netbanking' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodClick('netbanking')}
                >
                  <FaUniversity className='payment-icon' />
                  <span>NetBanking</span>
                </div>
              </div>
            </div>

            <div className='col-lg-5'>
              <div className='payment-container1'>{selectedPaymentPage}</div>
            </div>
            <div className='col-lg-4'>
              {/* Order details */}
              <div className='checkout__order'>
                <h5>Your order</h5>
                <div className='checkout__order__product'>
                  <ul>
                    <li>
                      <span className='top__text'>Product</span>
                      <span className='top__text__right'>Total</span>
                    </li>
                    <li>
                      01. Chain buck bag <span>$ 300.0</span>
                    </li>
                    <li>
                      02. Zip-pockets pebbled
                      <br /> tote briefcase <span>$ 170.0</span>
                    </li>
                    <li>
                      03. Black jean <span>$ 170.0</span>
                    </li>
                    <li>
                      04. Cotton shirt <span>$ 110.0</span>
                    </li>
                  </ul>
                </div>
                <div className='checkout__order__total'>
                  <ul>
                    <li>
                      Subtotal <span>$ 750.0</span>
                    </li>
                    <li>
                      Total <span>$ 750.0</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='footer-icon'>
          <img src={upiicon} alt='' className='icon-size' />
          <img src={visa} alt='' className='icon-size' />
          <img src={mastercard} alt='' className='icon-size' />
          <img src={rupay} alt='' className='icon-size' />
          <img src={paypal} alt='' className='icon-size' />
        </div>
        <div className='footer'>
          <a href=''>
            <span>Need help ? Contact Us</span>
          </a>
        </div>
      </section>
    </>
  );
}

export default PaymentPage;
