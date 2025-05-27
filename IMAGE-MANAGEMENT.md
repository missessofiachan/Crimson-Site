# Image Management Features

## Cloudinary Image Storage & Automatic Deletion

This implementation provides automatic deletion of product images when products are deleted or updated, using Cloudinary for cloud-based image hosting instead of local file storage.

### Migration to Cloudinary

**Status: ✅ COMPLETED**
- Migrated from local file storage (`public/uploads/`) to Cloudinary cloud storage
- All new images are uploaded to Cloudinary
- Image deletion now works with Cloudinary's API
- Resolves Vercel deployment issues with file storage

### Features Implemented

1. **Cloudinary Image Upload**
   - Images are uploaded directly to Cloudinary via `/api/upload` endpoint
   - Returns secure HTTPS URLs for stored images
   - Supports all common image formats (JPG, PNG, GIF, WebP, etc.)

2. **Delete Product Images on Product Deletion**
   - When a product is deleted via the DELETE endpoint `/api/store/items/[id]`, the associated image is automatically deleted from Cloudinary
   - Uses Cloudinary's API to permanently remove images from their servers

3. **Delete Old Images on Product Update**
   - When a product's image is updated via the PUT endpoint `/api/store/items/[id]`, the old image is automatically deleted from Cloudinary
   - Prevents accumulation of unused images in Cloudinary storage
   - Handles cases where an image is completely removed from a product

4. **Manual Cleanup Interface**
   - Endpoint `/api/store/cleanup` (POST) provides admin-only access for cleanup operations
   - Note: Cloudinary cleanup is simplified as we can't easily list all images without additional tracking

### Technical Implementation

#### Cloudinary Configuration (`lib/cloudinary.ts`)

- `uploadToCloudinary(buffer: Buffer, folder?: string)` - Uploads image buffer to Cloudinary
- `deleteFromCloudinary(imageUrl: string)` - Deletes image from Cloudinary using public_id extraction

#### Updated Utility Functions (`lib/fileUtils.ts`)

- `deleteImageFile(imageUrl: string)` - Now deletes from Cloudinary instead of local files
- `deleteImageFiles(imageUrls: string[])` - Handles multiple Cloudinary deletions
- `cleanupOrphanedImages(db)` - Simplified for Cloudinary (requires manual tracking)

#### Modified API Endpoints

- **DELETE `/api/store/items/[id]`** - Now deletes associated image from Cloudinary before deleting the product
- **PUT `/api/store/items/[id]`** - Now deletes old image from Cloudinary when a new one is uploaded or when image is removed
- **POST `/api/upload`** - Updated to upload images to Cloudinary instead of local storage
- **POST `/api/store/cleanup`** - Endpoint for manual cleanup (admin only, simplified for Cloudinary)

#### Environment Configuration

Required environment variables in `.env.local`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

#### Next.js Configuration

Updated `next.config.ts` to allow Cloudinary domains:
```typescript
images: {
  domains: ['res.cloudinary.com', 'localhost'],
  unoptimized: process.env.NODE_ENV === 'development',
}
```

### Usage

#### Automatic Cleanup
- Image deletion happens automatically when products are deleted or updated
- Images are permanently removed from Cloudinary servers
- No manual intervention required

#### Manual Cleanup
1. Navigate to the store management dashboard (`/dashboard/store`)
2. Use admin privileges to access cleanup functionality
3. Monitor Cloudinary storage usage through their dashboard

### Benefits

- **Cloud Storage** - Reliable, scalable image hosting via Cloudinary
- **Vercel Compatible** - Resolves deployment issues with local file storage
- **Automatic Maintenance** - Images are cleaned up when products are deleted/updated
- **Cost Efficiency** - Prevents accumulation of unused images in Cloudinary storage
- **Performance** - Fast global CDN delivery of images

### Testing Status

✅ **Upload Functionality** - Images upload successfully to Cloudinary
✅ **Display Functionality** - Images display correctly from Cloudinary URLs  
✅ **Deletion Functionality** - Images are deleted from Cloudinary when products are deleted
✅ **Update Functionality** - Old images are removed when product images are updated
✅ **API Integration** - All endpoints working with Cloudinary
✅ **Authentication** - Cleanup endpoint properly secured for admin-only access

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
