import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const NavAuth = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
          const token = localStorage.getItem('access_token');
          if (!token) {
            navigate('/clt/login');
            return;
          }
          else{
            navigate('/prfl');
          }
        };
    
        fetchUser();
      }, [navigate]);




  return (
    <div>NavAuth</div>
  )
}

export default NavAuth