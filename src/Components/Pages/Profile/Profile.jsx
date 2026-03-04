// src/pages/Profile.jsx
import React, { useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import Layouts from '../Layouts/Layouts';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();


  if (!isAuthenticated) return <p>Redirecting to login...</p>;

  return (
    <Layouts>
        <div className='text-white'>Welcome, {accounts[0]?.name}</div>
    </Layouts>
  );
};

export default Profile;
