import aws, { S3 } from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';
import dayjs from 'dayjs';

export class S3StorageService {
  private s3: aws.S3;
  private s3Config: S3Client;
  private bucketName: string;

  constructor() {
    // Use environment variables for AWS credentials
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    const region = process.env.AWS_REGION || 'us-east-2';
    this.bucketName = process.env.AWS_S3_BUCKET || 'tamburinstudio-storage';

    // Configure AWS SDK v2
    aws.config.update({
      accessKeyId,
      secretAccessKey,
      region
    });

    this.s3 = new aws.S3();

    // Configure AWS SDK v3
    this.s3Config = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  }

  public GetS3Client() {
    return this.s3Config;
  }

  public getBucketName() {
    return this.bucketName;
  }

  public uploadLocalFile(fileName: string, fileBody: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.bucketName,
        Key: 'images/' + fileName,
        ACL: 'public-read',
        Body: fileBody
      };

      try {
        this.s3.upload(params, (err: any, data: any) => {
          err ? reject(err) : resolve(data.Location);
        });
      }catch (err) {
        if (err) {
          console.log(err)
        }
      }
    });
  }

  public getSingedPutUrl(folder: string, fileName: string, expires: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.bucketName,
        //Key: fileName,
        Key: 'images/' + folder + '/[' + dayjs().format('YYYY-MM-DD') + ']' + '/' + dayjs().format('HH_mm_ss') + '_' + fileName,
        Expires: expires,
        ACL: 'public-read',
      };

      try {
        this.s3.getSignedUrl('putObject', params, (err, url) => {
          err ? reject(err) : resolve(url);
        });
      }catch (err) {
        if (err) {
          console.log(err)
        }
      }
    });
  }

  public deleteObject(objectKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      var params = {
        Bucket: this.bucketName,
        Key: objectKey
      };

      this.s3.deleteObject(params, function (err: aws.AWSError, result: aws.S3.Types.DeleteObjectOutput) {
        if(err) {
          console.warn(err);
          reject(err);
        }else{
          resolve(objectKey);
        }
      });
    });
  }

  public async deleteContainer(folder: string, requestParams: S3.Types.ListObjectsV2Request | null): Promise<string>{
    var params;
    if(requestParams != null) {
      params = requestParams;
    }else{
      params = {
        Bucket: this.bucketName,
        Prefix: folder + '/'
      };
    }

    const listedObjects = await this.s3.listObjectsV2(params).promise();
    if(listedObjects.Contents?.length == 0) {
        return '';
    }else{
      let deleteParams = {
        "Bucket": this.bucketName,
        "Delete": { "Objects": listedObjects.Contents!.map(a => ({ "Key": a.Key! })) }
      };

      const deleteObjects = await this.s3.deleteObjects(deleteParams).promise();
      if(deleteObjects.Errors && deleteObjects.Errors.length > 0){
        return '';
      }else{
        if (listedObjects.IsTruncated) { //파일이 더 남아있는 경우.
          let obj = Object.assign({}, params, {
              ContinuationToken: listedObjects.NextContinuationToken
          });
          await this.deleteContainer(folder, obj);
        }else{
          //모든 파일 제거 완료.
          return folder;
        }
      }
    }

    return '';
  }
}
