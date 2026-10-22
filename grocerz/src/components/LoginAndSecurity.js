import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginAndSecurityPage() {
  const [name, setName] = useState('Manu');
  const [email, setEmail] = useState('manusaini09092001@gmail.com');
  const [mobileNumber, setMobileNumber] = useState('+919084880935');
  const [password, setPassword] = useState('**********');
  const navigate = useNavigate();

  return (
    <div className='container mx-auto max-w-md my-3 mb-4 mt-8'>
      <h2 className='text-xl font-semibold mb-4'>Login and Security</h2>
      <div className='border border-black rounded'>
        <div className='mb-4 mx-3 my-2 border-b pb-2 '>
          <label htmlFor='name' className='block mb-1'>
            Name:
          </label>
          <div className='page'>
            <span className=''>{name}</span>
            <button
              onClick={() => navigate('/nameedit')}
              className='text-blue-500 bg-transparent border border-blue-500  px-2 rounded inline-block hover:bg-blue-500  hover:text-white'
            >
              Edit
            </button>
          </div>
        </div>
        <hr class='w-48 h-1 mx-auto my-4 border-1 rounded md:my-10 dark:bg-black'></hr>
        <div className='mb-4 mx-3 border-b pb-2 '>
          <label htmlFor='email' className='block mb-1'>
            Email:
          </label>
          <div className='page'>
            <span className='mr-auto'>{email}</span>
            <button
              onClick={() => navigate('/Emailedit')}
              className='text-blue-500 bg-transparent border border-blue-500 py-1 px-2 rounded inline-block hover:bg-blue-500 hover:text-white'
            >
              Edit
            </button>
          </div>
        </div>
        <hr class='w-48 h-1 mx-auto my-4 border-1 rounded md:my-10 dark:bg-black'></hr>
        <div className='mb-4 mx-3 border-b pb-2 '>
          <label htmlFor='mobileNumber' className='block mb-1'>
            Primary Mobile Number:
          </label>
          <div className='page'>
            <span className='mr-auto'>{mobileNumber}</span>
            <button
              onClick={() => navigate('/mobilenoedit')}
              className='text-blue-500 bg-transparent border border-blue-500 py-1 px-2 rounded inline-block hover:bg-blue-500 hover:text-white'
            >
              Edit
            </button>
          </div>
        </div>
        <hr class='w-48 h-1 mx-auto my-4 border-1 rounded md:my-10 dark:bg-black'></hr>
        <div className='mb-4 mx-3 r'>
          <label htmlFor='password' className='block mb-1'>
            Password:
          </label>
          <div className='page'>
            <span className='mr-auto'>{password}</span>
            <button
              onClick={() => navigate('/ChangePassword')}
              className='text-blue-500 border border-blue-500 py-1 px-2 rounded hover:bg-blue-500 hover:text-white'
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAndSecurityPage;
