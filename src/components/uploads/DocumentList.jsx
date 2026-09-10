import React, { useEffect, useState } from 'react';
import { getMyLgaDocuments } from '../../services/documentService';
import { toast } from 'react-toastify';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
  const res = await getMyLgaDocuments();
  const list = Array.isArray(res) ? res : (res?.data || []);
  setDocuments(list);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
      {loading ? (
        <Skeleton rows={4} />
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents uploaded"
          description="You haven't uploaded any documents yet. Use the upload form to add files that can be shared with your LGA."
        />
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li key={doc.id} className="border p-4 rounded bg-gray-50">
              <p className="font-medium">{doc.title}</p>
              <a
                href={doc.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View File
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentList;
