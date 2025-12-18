// ImageBB upload utility
// ImageBB API key should be stored in environment variables

export const uploadImageToImageBB = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        url: data.data.url,
        deleteUrl: data.data.delete_url
      };
    } else {
      throw new Error('Image upload failed');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

