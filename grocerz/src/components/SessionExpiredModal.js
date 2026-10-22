import React, { useEffect } from 'react';

const SessionExpiredModal = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/login';
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{
          backdropFilter: 'blur(30px)', // stronger blur
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // darker transparent overlay
        }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content text-center shadow-lg rounded-4"
            style={{
              backgroundColor: '#ffffffcc', // semi-transparent white
              backdropFilter: 'blur(10px)', // blur inside modal
            }}
          >
            <div className="modal-header border-0 position-relative">
              <h5 className="modal-title text-success w-100">Session Expired</h5>
              <button
                type="button"
                className="btn-close position-absolute"
                style={{ top: '3px', right: '8px' }} // move close button slightly above
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              <p className="text-muted">Please login again to continue.</p>
            </div>
            <div className="modal-footer border-0 justify-content-center">
              <a href="/login" className="btn btn-success px-4">
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionExpiredModal;
