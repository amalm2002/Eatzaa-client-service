
import { sha1 } from 'crypto-hash';

export const deleteFromCloudinary = async (publicId: string) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

  const cleanPublicId = publicId.replace(/\.[^/.]+$/, '');

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureString = `public_id=${cleanPublicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1(signatureString);

  const formData = new FormData();
  formData.append('public_id', cleanPublicId);
  formData.append('api_key', apiKey);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
    });
    console.log('delete responseeeeeeeee :', response);

    const data = await response.json();
    console.log('delete data:', data);

    if (data.result === 'ok' || data.result === 'not found') {
      console.log(`Image ${cleanPublicId} deleted or already not found on Cloudinary`);
      return true; 
    } else {
        alert(`failed to delete image : ${data.result}`)
    //   throw new Error(`Failed to delete image: ${data.result || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    alert('interanal error on delete image ')
    // throw error; 
  }
};