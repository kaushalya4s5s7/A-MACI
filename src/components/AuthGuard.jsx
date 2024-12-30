import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../utils/auth';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/login');
    }
  }, [navigate]);

  return children;
};
export default AuthGuard;