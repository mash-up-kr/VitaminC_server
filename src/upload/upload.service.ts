import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import AWS, { S3 } from 'aws-sdk';

const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');

@Injectable()
export class UploadService {
  private readonly awsS3: S3;

  constructor(private readonly configService: ConfigService) {
    this.awsS3 = new S3({
      endpoint,
      accessKeyId: this.configService.get('NCP_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('NCP_SECRET_ACCESS_KEY'),
      region: 'kr-standard',
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = '') {
    const uploadResult = await this.awsS3
      .upload({
        Bucket: this.configService.get('NCP_BUCKET_NAME'),
        Key: folder + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    return uploadResult.Location;
  }
}
