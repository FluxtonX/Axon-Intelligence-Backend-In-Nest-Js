export declare class UploadsService {
    private s3;
    private bucketName;
    constructor();
    getPresignedUrl(filename: string, contentType: string): Promise<{
        uploadUrl: string;
        key: string;
        publicUrl: string;
    }>;
}
