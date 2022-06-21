import { Injectable } from '@nestjs/common';
import {
  PutObjectAclCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const credentials = {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    };

    const region = this.configService.get('AWS_REGION');

    this.client = new S3Client({ credentials, region });
    this.bucket = this.configService.get('AWS_BUCKET');
  }

  upload(file: Express.Multer.File): Promise<PutObjectAclCommandOutput> {

    const command = new PutObjectCommand({
      Body: file.buffer,
      Bucket: this.bucket,
      Key: file.originalname,
    });

    return this.client.send(command);
  }
}
