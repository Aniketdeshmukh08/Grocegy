import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function EmailEditPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const handleSubmit = e => {
    e.preventDefault();
    setEmail(email);
    navigate('/loginandsecurity');
  };
  const onCancel = () => {
    navigate('/loginandsecurity');
  };
  return (
    <div className='container mx-auto max-w-md mt-8 '>
      <h2 className='text-xl font-semibold mb-4 my-5 '>Edit Email</h2>
      <div className='border rounded '>
        <form onSubmit={handleSubmit}>
          <div className='mb-4 mx-2 my-2'>
            <label htmlFor='email' className='block mb-1'>
              Email:
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full mx-2 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
            />
          </div>
          <div>
            <button
              type='submit'
              className='bg-blue-500 mx-2 text-black px-4 py-2 rounded hover:bg-blue-600 mr-2'
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className='bg-gray-400 mx-2 mb-2 text-black px-4 py-2 rounded hover:bg-gray-500'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailEditPage;
