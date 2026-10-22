import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('jwttoken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000;
        const currentTime = Date.now();

        if (currentTime >= expiryTime) {
          localStorage.removeItem('jwttoken');
          localStorage.removeItem('userid');
          localStorage.removeItem('usertype');
          alert('Your session has expired. Please log in again.');
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('jwttoken');
        navigate('/login');
      }
    };

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, [navigate]);
};

export default useAutoLogout;