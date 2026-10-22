import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoutes({ props }) {
  const { Component } = props;
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('jwttoken')) {
      navigate('/login');
    }
  }, []);
  return <Component />;
}
