import { UploadsService } from './uploads.service';
export declare class PresignedUrlDto {
    filename: string;
    contentType: string;
}
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    getPresignedUrl(dto: PresignedUrlDto): Promise<{
        uploadUrl: string;
        key: string;
        publicUrl: string;
    }>;
    uploadFileLocally(file: Express.Multer.File, req: any): {
        uploadUrl: string;
        key: string;
        publicUrl: string;
    };
}
