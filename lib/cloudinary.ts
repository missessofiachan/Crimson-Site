import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary from a buffer
 * @param buffer - The image buffer data
 * @param folder - The folder in Cloudinary where the image will be stored
 * @returns The URL of the uploaded image
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'uploads'
): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result!.secure_url);
            }
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

/**
 * Delete an image from Cloudinary
 * @param imageUrl - The Cloudinary image URL
 * @returns Promise<boolean> - Returns true if deleted successfully
 */
export async function deleteFromCloudinary(imageUrl: string): Promise<boolean> {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex((part) => part === 'upload');
    if (uploadIndex === -1) return false;

    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove file extension

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}
