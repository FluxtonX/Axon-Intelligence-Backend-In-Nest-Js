import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PresignedUrlDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contentType: string;
}

@ApiTags('uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presigned-url')
  @ApiOperation({ summary: 'Get a secure presigned URL for direct S3 upload' })
  getPresignedUrl(@Body() dto: PresignedUrlDto) {
    return this.uploadsService.getPresignedUrl(dto.filename, dto.contentType);
  }

  @Post('local')
  @ApiOperation({ summary: 'Upload file locally for development' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  uploadFileLocally(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Return a relative URL. The frontend will dynamically prepend the correct API_BASE_URL.
    // This prevents broken images when the local Wi-Fi IP address changes.
    const relativeUrl = `/uploads/${file.filename}`;
    
    return {
      uploadUrl: relativeUrl,
      key: file.filename,
      publicUrl: relativeUrl
    };
  }
}
