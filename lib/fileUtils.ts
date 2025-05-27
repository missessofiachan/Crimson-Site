import { unlink, readdir } from "fs/promises";
import { join } from "path";

/**
 * Delete an image file from the uploads directory
 * @param imageUrl - The image URL path (e.g., "/uploads/filename.jpg")
 * @returns Promise<boolean> - Returns true if deleted successfully, false otherwise
 */
export async function deleteImageFile(imageUrl: string): Promise<boolean> {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
    return false;
  }

  try {
    // Extract filename from imageUrl (e.g., "/uploads/filename.jpg" -> "filename.jpg")
    const filename = imageUrl.replace('/uploads/', '');
    const imagePath = join(process.cwd(), 'public', 'uploads', filename);
    
    // Delete the image file
    await unlink(imagePath);
    console.log(`Successfully deleted image: ${imageUrl}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete image ${imageUrl}:`, error);
    return false;
  }
}

/**
 * Delete multiple image files from the uploads directory
 * @param imageUrls - Array of image URL paths
 * @returns Promise<{ success: number, failed: number }> - Returns count of successful and failed deletions
 */
export async function deleteImageFiles(imageUrls: string[]): Promise<{ success: number, failed: number }> {
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
 * Find and delete orphaned image files (images that exist in uploads but are not referenced by any product)
 * @param db - MongoDB database instance
 * @returns Promise<{ deleted: string[], errors: string[] }> - Returns arrays of deleted files and errors
 */
export async function cleanupOrphanedImages(db: any): Promise<{ deleted: string[], errors: string[] }> {
  const deleted: string[] = [];
  const errors: string[] = [];

  try {
    // Get all image files from uploads directory
    const uploadsPath = join(process.cwd(), 'public', 'uploads');
    let uploadedFiles: string[] = [];
    
    try {
      uploadedFiles = await readdir(uploadsPath);
    } catch (error) {
      console.log('No uploads directory found or empty');
      return { deleted, errors };
    }

    // Get all imageUrls from the database
    const products = await db.collection("storeItems").find({}, { projection: { imageUrl: 1 } }).toArray();
    const referencedImages = new Set(
      products
        .filter((product: any) => product.imageUrl)
        .map((product: any) => product.imageUrl.replace('/uploads/', ''))
    );

    // Find orphaned files
    const orphanedFiles = uploadedFiles.filter(file => 
      !referencedImages.has(file) && 
      // Only consider image files
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    );

    // Delete orphaned files
    for (const filename of orphanedFiles) {
      const imageUrl = `/uploads/${filename}`;
      const success = await deleteImageFile(imageUrl);
      
      if (success) {
        deleted.push(imageUrl);
      } else {
        errors.push(`Failed to delete ${imageUrl}`);
      }
    }

    console.log(`Cleanup completed: ${deleted.length} files deleted, ${errors.length} errors`);
    return { deleted, errors };

  } catch (error) {
    console.error('Error during orphaned images cleanup:', error);
    errors.push(`Cleanup error: ${error}`);
    return { deleted, errors };
  }
}
