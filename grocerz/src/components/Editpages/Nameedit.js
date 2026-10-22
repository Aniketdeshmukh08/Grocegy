import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function NameEditPage() {
  const [name, setName] = useState();
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    setName(name); // Update the name in LoginAndSecurityPage
    navigate('/loginandsecurity'); // Navigate back to LoginAndSecurityPage
  };

  const handleCancel = () => {
    navigate('/loginandsecurity'); // Navigate back to LoginAndSecurityPage
  };

  return (
    <div className='container mx-auto max-w-md mt-8 mx-auto'>
      <h2 className='text-xl font-semibold mb-4 my-5'>Edit Name</h2>
      <div className='border rounded '>
        <form onSubmit={handleSubmit}>
          <div className='mb-4 mx-2 my-2'>
            <label htmlFor='name' className='block mb-1'>
              Name:
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full mx-2 p-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1'
            />
          </div>
          <div className='mx-2'>
            <button
              type='submit'
              className='bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600 mr-2'
            >
              Save
            </button>
            <button
              onClick={handleCancel}
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

export default NameEditPage;
