import React, { useState } from 'react';
import { uploadDocument } from '../../services/documentService';
import { toast } from 'react-toastify';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error('All fields required');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      setUploading(true);
      await uploadDocument(formData);
      toast.success('File uploaded successfully');
      setFile(null);
      setTitle('');
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md w-full max-w-md">
      <h3 className="text-lg font-semibold">Upload LGA Document</h3>

      <div>
        <label className="block font-medium">Document Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Select File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border px-3 py-2 rounded w-full"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default UploadForm;
