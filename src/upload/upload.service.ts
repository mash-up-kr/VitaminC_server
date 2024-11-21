import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3 } from 'aws-sdk';

@Injectable()
export class UploadService {
  private readonly awsS3: S3;

  constructor(private readonly configService: ConfigService) {
    this.awsS3 = new S3({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = '') {
    try {
      const uploadResult = await this.awsS3
        .upload({
          Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
          Key: folder + file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        })
        .promise();

      return uploadResult.Location;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
