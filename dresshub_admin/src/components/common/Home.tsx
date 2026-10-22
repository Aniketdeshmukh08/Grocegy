import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='row'>
      <div className='col-6 bg-info bg-opacity-50'>
        <h3>ExamHub</h3>
      </div>
      <div className='col-6 bg-info bg-opacity-50 '>
        <div className='text-right d-flex justify-content-end'>
          <Link to='/login' className='btn btn-primary'>
            Login
          </Link>
        </div>
      </div>
      <div className='col-12 bg-warning bg-opacity-10'>
        ExamHub
        <br></br>
        ExamHub
        <br></br>
        ExamHub
        <br></br>
        ExamHub
        <br></br>
        ExamHub
        <br></br>
        ExamHub
        <br></br>
        ExamHub
        <br></br>
      </div>
      <div className='col-12 bg-info bg-opacity-50'>Copyright - Examhub</div>
    </div>
  );
};

export default Home;
