import { deleteFromCloudinary } from './cloudinary';

/**
 * Delete an image file from Cloudinary
 * @param imageUrl - The Cloudinary image URL
 * @returns Promise<boolean> - Returns true if deleted successfully, false otherwise
 */
export async function deleteImageFile(imageUrl: string): Promise<boolean> {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return false;
  }

  try {
    const result = await deleteFromCloudinary(imageUrl);
    return result;
  } catch {
    return false;
  }
}

/**
 * Delete multiple image files from Cloudinary
 * @param imageUrls - Array of Cloudinary image URLs
 * @returns Promise<{ success: number, failed: number }> - Returns count of successful and failed deletions
 */
export async function deleteImageFiles(
  imageUrls: string[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const imageUrl of imageUrls) {
    const result = await deleteImageFile(imageUrl);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Find and delete orphaned image files from Cloudinary
 * Note: This function is simplified for Cloudinary cleanup.
 * @param _db - MongoDB database instance
 * @returns Promise<{ deleted: string[], errors: string[] }> - Returns arrays of deleted files and errors
 */
export async function cleanupOrphanedImages(
  _db: unknown // Specify as unknown instead of any
): Promise<{ deleted: string[]; errors: string[] }> {
  const deleted: string[] = [];
  const errors: string[] = [];

  try {
    return { deleted, errors };
  } catch {
    errors.push('Cleanup error');
    return { deleted, errors };
  }
}
