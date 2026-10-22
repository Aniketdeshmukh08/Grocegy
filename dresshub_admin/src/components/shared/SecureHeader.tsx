import React from 'react';

const SecureHeader = () => {
  return (
    <div className='row secureheader'>
      <div className='col-6 bg-info bg-opacity-50'>
        <h3>ExamHub</h3>
      </div>
      <div className='col-6 bg-info bg-opacity-50 '>
        <div className='text-right d-flex justify-content-end'></div>
      </div>
    </div>
  );
};

export default SecureHeader;
