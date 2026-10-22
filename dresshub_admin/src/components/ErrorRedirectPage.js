import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'

export default function ErrorRedirectPage({msg}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };


  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center text-center vh-100 bg-white p-2">
      
      <img src={logo} alt="Grocji Logo" style={{ width: '220px' }} className="mb-5" />

      <h1 className="display-3 text-danger fw-bold mb-3">Oops! Something went wrong</h1>

      {/* <p className="fs-3 text-muted mb-3">We couldn’t find the page you are looking for.</p> */}
      <p className="fs-3 text-muted mb-3">{msg}</p>

      <div className="d-flex gap-4 mt-2 flex-wrap justify-content-center">
        <button class='shop-btn' onClick={handleBack}>
          Back to Dashboard
        </button>
        
      </div>

      <p className="mt-5 text-secondary fs-5">If the issue persists, please try again later or contact support.</p>
    </div>
  );
}