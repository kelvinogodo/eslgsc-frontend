import React, { useState, useEffect } from 'react';
import { createLGA, updateLGA } from '../../services/lgaService';
import { toast } from 'react-toastify';

const LGAForm = ({ existing, onSuccess }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setCode(existing.code);
    }
  }, [existing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !code) return toast.error('All fields are required');

    setLoading(true);

    try {
      if (existing) {
        await updateLGA(existing.id, { name, code });
        toast.success('LGA updated successfully');
      } else {
        await createLGA({ name, code });
        toast.success('LGA created successfully');
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit LGA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded">
      <div className="mb-4">
        <label className="block text-sm font-medium">LGA Name</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Owerri North"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">LGA Code</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mt-1"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. OWRN01"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Submitting...' : existing ? 'Update LGA' : 'Create LGA'}
      </button>
    </form>
  );
};

export default LGAForm;
