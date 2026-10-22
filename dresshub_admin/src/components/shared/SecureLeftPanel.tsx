import React from 'react';
import { Link } from 'react-router-dom';

const SecureLeftPanel = () => {
  return (
    <div className='col-2 bg-info bg-opacity-50'>
      {/* <Link to='' className='btn btn-success'>Students Options</Link><br></br><br></br>
          <Link to='/dashboard' className='btn btn-primary'>Dashboard</Link><br></br>
          <Link to='/examlist' className='btn btn-primary'>Upcoming Exams</Link><br></br>
          <Link to='/examtaken' className='btn btn-primary'>Exams Taken</Link><br></br>
          <Link to='/' className='btn btn-primary'>Logout</Link><br></br><br></br> */}

      <Link to='' className='btn btn-success'>
        Admin Options
      </Link>
      <br></br>
      <br></br>
      <Link to='/qslist' className='btn btn-primary'>
        Questions CRUD
      </Link>
      <br></br>
      <Link to='/examslist' className='btn btn-primary'>
        Exams CRUD
      </Link>
      <br></br>
      <Link to='/userslist' className='btn btn-primary'>
        Users CRUD
      </Link>
      <br></br>
      <Link to='/' className='btn btn-primary'>
        Logout
      </Link>
      <br></br>
      <br></br>
      {/* <Link to='/' className='btn btn-primary'>Subjects CRUD</Link><br></br> */}
    </div>
  );
};

export default SecureLeftPanel;
