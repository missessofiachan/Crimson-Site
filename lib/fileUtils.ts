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
    if (result) {
      console.log(`Successfully deleted image: ${imageUrl}`);
    }
    return result;
  } catch (error) {
    console.error(`Failed to delete image ${imageUrl}:`, error);
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
 * Note: This function is simplified for Cloudinary as we can't easily list all images
 * @param db - MongoDB database instance
 * @returns Promise<{ deleted: string[], errors: string[] }> - Returns arrays of deleted files and errors
 */
export async function cleanupOrphanedImages(
  db: any
): Promise<{ deleted: string[]; errors: string[] }> {
  const deleted: string[] = [];
  const errors: string[] = [];

  try {
    console.log('Note: Orphaned image cleanup for Cloudinary requires manual review');
    console.log('Consider implementing a scheduled job to track and clean unused images');

    // For now, this function is a placeholder
    // In a production environment, you would want to:
    // 1. Keep track of uploaded images in a separate collection
    // 2. Periodically compare with referenced images
    // 3. Delete unreferenced images after a grace period

    return { deleted, errors };
  } catch (error) {
    console.error('Error during orphaned images cleanup:', error);
    errors.push(`Cleanup error: ${error}`);
    return { deleted, errors };
  }
}
