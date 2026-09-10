import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';

const AllDocumentsList = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/uploads/all');
      setDocs(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const downloadDocument = async (doc) => {
    setDownloadingId(doc.id);
    try {
      // Prefer a server-provided absolute/signed file URL only when it's an absolute URL.
      // Otherwise call the protected canonical endpoint on the API so Authorization is honored.
      const isAbsoluteUrl = typeof doc.fileUrl === 'string' && /^https?:\/\//i.test(doc.fileUrl);
      const endpoint = isAbsoluteUrl ? doc.fileUrl : `/uploads/${encodeURIComponent(doc.filename)}`;

      // Use the existing axios instance so Authorization header (if any) is sent.
      // If `endpoint` is a full URL axios will use it as-is; if it's a relative path it will be resolved against api.baseURL.
      const res = await api.get(endpoint, { responseType: 'blob' });

      // Parse suggested filename from Content-Disposition when available.
      const cd = res.headers && (res.headers['content-disposition'] || res.headers['Content-Disposition']);
      const parseFilenameFromContentDisposition = (contentDisposition) => {
        if (!contentDisposition) return null;
        // RFC5987 filename* or basic filename
        const filenameStarMatch = /filename\*=UTF-8''([^;\n]+)/i.exec(contentDisposition);
        if (filenameStarMatch && filenameStarMatch[1]) {
          try { return decodeURIComponent(filenameStarMatch[1].trim().replace(/^"|"$/g, '')); } catch { return filenameStarMatch[1].trim(); }
        }
        const filenameMatch = /filename="?([^";]+)"?/i.exec(contentDisposition);
        if (filenameMatch && filenameMatch[1]) return filenameMatch[1].trim();
        return null;
      };

      const suggestedName = parseFilenameFromContentDisposition(cd) || doc.filename || 'download';

      // Build a blob and trigger a programmatic download so the request can be authenticated
      const contentType = (res.headers && (res.headers['content-type'] || res.headers['Content-Type'])) || 'application/octet-stream';
      const blob = new Blob([res.data], { type: contentType });
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed', err);
      const status = err?.response?.status;
      if (status === 401) {
        toast.error('You must be logged in to download this file');
      } else if (status === 403) {
        toast.error('You do not have permission to download this file');
      } else {
        toast.error('Failed to download file');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-lg font-medium mb-2">All Uploaded Documents</h2>
      {loading ? (
        <Skeleton rows={4} />
      ) : docs.length === 0 ? (
        <EmptyState title="No documents" description="No documents uploaded yet." />
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Filename</th>
              <th className="p-2 text-left">LGA</th>
              <th className="p-2 text-left">Uploaded At</th>
              <th className="p-2 text-left">View</th>
            </tr>
          </thead>
          <tbody>
            {docs.map(doc => (
              <tr key={doc.id} className="border-t">
                <td className="p-2">{doc.filename}</td>
                <td className="p-2">{doc.lga?.name || 'N/A'}</td>
                <td className="p-2">{new Date(doc.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => downloadDocument(doc)}
                    className="text-blue-600 hover:underline"
                    disabled={downloadingId === doc.id}
                  >
                    {downloadingId === doc.id ? 'Downloading...' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllDocumentsList;
