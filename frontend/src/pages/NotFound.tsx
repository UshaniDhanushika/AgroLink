import React from 'react';
import ErrorPage from '../components/common/ErrorPage';

const NotFound: React.FC = () => {
  return (
    <ErrorPage 
      title="404 - Page Not Found" 
      message="The page you are looking for does not exist or has been moved." 
    />
  );
};

export default NotFound;
