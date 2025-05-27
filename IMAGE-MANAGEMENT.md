# Image Management Features

## Automatic Image Deletion

This implementation provides automatic deletion of product images when products are deleted or updated, helping to save disk space and maintain a clean file system.

### Features Implemented

1. **Delete Product Images on Product Deletion**
   - When a product is deleted via the DELETE endpoint `/api/store/items/[id]`, the associated image file is automatically deleted from the `public/uploads/` directory
   - The system safely handles cases where the image file doesn't exist or can't be deleted

2. **Delete Old Images on Product Update**
   - When a product's image is updated via the PUT endpoint `/api/store/items/[id]`, the old image file is automatically deleted
   - This prevents accumulation of unused image files when users replace product images
   - Also handles cases where an image is completely removed from a product

3. **Manual Cleanup of Orphaned Images**
   - New endpoint `/api/store/cleanup` (POST) allows admins to manually clean up orphaned image files
   - Finds and deletes image files that exist in the uploads folder but are no longer referenced by any product
   - Accessible via a "Cleanup Images" button in the store management dashboard

### Technical Implementation

#### New Utility Functions (`lib/fileUtils.ts`)

- `deleteImageFile(imageUrl: string)` - Deletes a single image file
- `deleteImageFiles(imageUrls: string[])` - Deletes multiple image files  
- `cleanupOrphanedImages(db)` - Finds and deletes orphaned images

#### Modified API Endpoints

- **DELETE `/api/store/items/[id]`** - Now deletes associated image before deleting the product
- **PUT `/api/store/items/[id]`** - Now deletes old image when a new one is uploaded or when image is removed
- **POST `/api/store/cleanup`** - New endpoint for manual cleanup (admin only)

#### UI Enhancements

- Added "Cleanup Images" button in the store management dashboard
- Button shows loading state and provides feedback on cleanup results

### Usage

#### Automatic Cleanup
- Image deletion happens automatically when products are deleted or updated
- No manual intervention required

#### Manual Cleanup
1. Navigate to the store management dashboard (`/dashboard/store`)
2. Click the "Cleanup Images" button
3. Confirm the action in the dialog
4. View the results showing how many files were deleted

### Safety Features

- Image deletion errors don't prevent product operations from completing
- Confirmation dialog for manual cleanup
- Detailed logging of deletion operations
- Only processes actual image files (jpg, jpeg, png, gif, webp, svg)
- Admin-only access for manual cleanup

### Benefits

- **Disk Space Savings** - Prevents accumulation of unused image files
- **Clean File System** - Maintains organization in the uploads directory
- **Automatic Maintenance** - Reduces need for manual file management
- **Error Resilience** - Continues operation even if image deletion fails
