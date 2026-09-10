import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Unauthorized Access</h1>
      <p className="mb-4">You don’t have permission to view this page.</p>
      <Link to="/login" className="text-blue-600 underline">
        Return to Login
      </Link>
    </div>
  );
};

export default Unauthorized;
