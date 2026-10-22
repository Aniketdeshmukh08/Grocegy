import React, { useEffect, useState } from 'react';

const Notice = () => {
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}settings/notice`
        );
        const data = await response.json();
        setNotice(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchNotice();
  }, []);

  if (!notice) {
    return null;
  }

  return (
    <>
      {notice.setting_value && (
        <div className='alert alert-info text-center p-4 shadow-lg'>
          <span className='fs-5'>{notice.setting_value}</span>
        </div>
      )}
    </>
  );
};

export default Notice;
