import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/uploads/my-lga');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Uploaded Documents</h2>
      {loading ? (
        <Skeleton rows={3} />
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents"
          description="There are no documents to show. Upload files to share with your team."
        />
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="border p-2 rounded">
              <p><strong>{doc.title}</strong></p>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(doc.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentList;
