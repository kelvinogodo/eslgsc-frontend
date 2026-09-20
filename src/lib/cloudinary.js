// Image uploads for article covers and in-article pictures.
// Cloudinary's unsigned upload preset is what the site already used; the
// values can be overridden per environment without a code change.
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dkaeqvi72';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'lwxo2qi3';

export const MAX_IMAGE_MB = 8;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const validateImage = (file) => {
  if (!file) return 'No file was chosen.';
  if (!ACCEPTED.includes(file.type)) return 'Please choose a JPG, PNG, WebP or GIF picture.';
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `That picture is too large. Please choose one under ${MAX_IMAGE_MB} MB.`;
  return null;
};

/**
 * Uploads a picture and resolves with its https URL.
 * `onProgress` receives 0-100. Rejects with an Error whose message is safe to show.
 */
export const uploadImage = (file, onProgress) =>
  new Promise((resolve, reject) => {
    const problem = validateImage(file);
    if (problem) {
      reject(new Error(problem));
      return;
    }

    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new Error('The upload failed. Please check your internet connection and try again.'));
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          onProgress?.(100);
          resolve(data.secure_url);
        } else {
          reject(new Error(data?.error?.message || 'The picture could not be uploaded. Please try again.'));
        }
      } catch {
        reject(new Error('The picture could not be uploaded. Please try again.'));
      }
    };
    xhr.send(body);
  });
