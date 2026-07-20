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
        const uniqueSuffix = uuidv4();
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  uploadFileLocally(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    // Construct local URL using request protocol and host
    const protocol = req.protocol;
    const host = req.get('host');
    const publicUrl = `${protocol}://${host}/uploads/${file.filename}`;
    
    return {
      uploadUrl: publicUrl,
      publicUrl: publicUrl,
      key: file.filename,
    };
  }
}
