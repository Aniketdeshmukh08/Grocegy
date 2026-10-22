import whatsappLogo from '../../assets/images/whatsapp-logo.png';
import topLogo from '../../assets/images/top-logo.png';

import { useState, useEffect } from 'react';
export default function Icon() {
  const [showTopBtn, setShowTopBtn] = useState('none');

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY === 0) {
        setShowTopBtn('none');
      } else {
        setShowTopBtn('block');
      }
    });
    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  const connectWhatsapp = () => {
    const phoneNumber = '+918757499345';
    const message = `Hi.`;

    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank').focus();
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          alignItems: 'center',
          zIndex: '1000',
        }}
      >
        <button type='button' onClick={connectWhatsapp}>
          <img
            src={whatsappLogo}
            alt='Whatsapp'
            style={{ width: '60px', height: '60px', mixBlendMode: 'multiply' }}
          />
        </button>

        <button
          type='button'
          style={{ display: `${showTopBtn}` }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={topLogo}
            alt='Go to top'
            style={{ width: '60px', height: '60px' }}
          />
        </button>
      </div>
    </>
  );
}
