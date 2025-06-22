<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    /**
     * Upload image to Cloudinary
     *
     * @param UploadedFile $file
     * @param string $folder
     * @return array
     */
    public function uploadImage(UploadedFile $file, string $folder = 'eventease'): array
    {
        try {
            $result = Cloudinary::uploadApi()->upload($file->getRealPath(), [
                'folder' => $folder,
                'transformation' => [
                    'quality' => 'auto',
                    'fetch_format' => 'auto'
                ]
            ]);

            return [
                'success' => true,
                'url' => $result['secure_url'],
                'public_id' => $result['public_id']
            ];
        } catch (\Exception $e) {
            Log::error('Cloudinary upload error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete image from Cloudinary
     *
     * @param string $publicId
     * @return array
     */
    public function deleteImage(string $publicId): array
    {
        try {
            $result = Cloudinary::destroy($publicId);
            
            return [
                'success' => $result['result'] === 'ok',
                'result' => $result
            ];
        } catch (\Exception $e) {
            Log::error('Cloudinary delete error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Upload event image with specific transformations
     *
     * @param UploadedFile $file
     * @return array
     */
    public function uploadEventImage(UploadedFile $file): array
    {
        try {
            Log::info('Starting event image upload', [
                'file_path' => $file->getRealPath(),
                'file_size' => $file->getSize(),
                'file_type' => $file->getMimeType(),
                'cloudinary_config_loaded' => config('filesystems.disks.cloudinary.cloud') !== null
            ]);

            $result = Cloudinary::uploadApi()->upload($file->getRealPath(), [
                'folder' => 'eventease/events',
                'transformation' => [
                    'width' => 800,
                    'height' => 600,
                    'crop' => 'fill',
                    'quality' => 'auto',
                    'fetch_format' => 'auto'
                ]
            ]);

            Log::info('Cloudinary upload response received', [
                'result' => $result
            ]);

            return [
                'success' => true,
                'url' => $result['secure_url'],
                'public_id' => $result['public_id']
            ];
        } catch (\Exception $e) {
            Log::error('Cloudinary event image upload error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Upload profile avatar with specific transformations
     *
     * @param UploadedFile $file
     * @return array
     */
    public function uploadAvatar(UploadedFile $file): array
    {
        try {
            $result = Cloudinary::uploadApi()->upload($file->getRealPath(), [
                'folder' => 'eventease/avatars',
                'transformation' => [
                    'width' => 200,
                    'height' => 200,
                    'crop' => 'fill',
                    'gravity' => 'face',
                    'quality' => 'auto',
                    'fetch_format' => 'auto'
                ]
            ]);

            return [
                'success' => true,
                'url' => $result['secure_url'],
                'public_id' => $result['public_id']
            ];
        } catch (\Exception $e) {
            Log::error('Cloudinary avatar upload error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}