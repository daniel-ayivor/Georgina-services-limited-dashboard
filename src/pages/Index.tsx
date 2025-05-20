
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirects to the dashboard from the root path
  return <Navigate to="/dashboard" replace />;
};

export default Index;
