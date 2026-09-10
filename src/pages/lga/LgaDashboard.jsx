import React from 'react';
import UploadForm from '../../components/uploads/UploadForm';
import DocumentList from '../../components/uploads/DocumentList';
import useAuth from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const LgaDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with User Info and Logout */}
      <div className="flex justify-between items-center mb-8 bg-gov-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gov-gray-600">
            Authenticated as: <strong className="text-gov-navy-900">{user?.name}</strong> 
            <span className="ml-2 px-2 py-0.5 bg-gov-blue-100 text-gov-blue-700 text-[10px] font-bold rounded uppercase">
              {user?.role}
            </span>
          </p>
          <p className="text-xs text-gov-gray-500 mt-0.5">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="space-y-12">
        <header>
          <h2 className="text-3xl font-bold text-gov-navy-900">LGA Information Portal</h2>
          <p className="text-gov-gray-600 mt-2">Manage official documents and circulars for your local government area.</p>
        </header>

        {/* Upload Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gov-navy-800 border-b pb-2">Upload Official Document</h3>
          <UploadForm />
        </section>

        {/* Document List */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gov-navy-800 border-b pb-2">Your Uploaded Records</h3>
          <DocumentList />
        </section>
      </div>
    </div>
  );
};

export default LgaDashboard;
