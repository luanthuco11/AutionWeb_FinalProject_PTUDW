import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import CloudflareR2 from "../config/cloudflare";

export type R2DirectoryType = "product" | "user" | "order";

export class R2Service {
  private readonly r2Client = CloudflareR2.getInstance();
  private readonly devUrl: string =
    process.env.R2_PUBLIC_DEV_URL ||
    "https://pub-ab2f2215803443f7bc2b22fed45d0aa1.r2.dev";

  private static _instance: R2Service;
  private constructor() {}

  static getInstance(): R2Service {
    if (!this._instance) {
      this._instance = new R2Service();
    }

    return this._instance;
  }

  public async uploadToR2(
    file: Express.Multer.File,
    directory?: R2DirectoryType
  ): Promise<string> {
    let key = "";
    try {
      const fileBuffer = file.buffer;
      const originalName = file.originalname;
      const contentType = file.mimetype;

      if (!fileBuffer) throw new Error("File is required");

      const fileName = Date.now() + "-" + originalName;
      key = directory ? `${directory}/${fileName}` : fileName;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await this.r2Client.send(command);
    } catch (e) {
      console.error("Fail to upload file", e);
    } finally {
      return key ? `${this.devUrl}/${key}` : "";
    }
  }

  public async uploadFilesToR2(
    files: Express.Multer.File[],
    directory?: R2DirectoryType
  ) {
    let uploadedUrls: string[] = [];
    try {
      const uploadPromises: Promise<string>[] = [];
      files.forEach((file) =>
        uploadPromises.push(this.uploadToR2(file, directory))
      );

      uploadedUrls = await Promise.all(uploadPromises);
    } catch (e) {
      console.error("Fail to upload files", e);
    } finally {
      return uploadedUrls;
    }
  }

  public async deleteFromR2(filePath: string): Promise<void> {
    try {
      if (!filePath)
        throw new Error("File path (URL) is required for deletion.");

      // 1. Trích xuất Key (tên file) từ URL
      const key = this.extractKeyFromUrl(filePath);

      const bucketName = process.env.R2_BUCKET_NAME!;

      // 2. Tạo lệnh xóa bằng Key đã trích xuất
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      // 3. Gửi lệnh
      await this.r2Client.send(command);
    } catch (e) {
      console.error("Fail to delete file", e);
    } finally {
      return;
    }
  }

  public async deleteFilesFromR2(filePaths: string[]): Promise<void> {
    try {
      const uploadPromises: Promise<void>[] = [];
      filePaths.forEach((filePath) =>
        uploadPromises.push(this.deleteFromR2(filePath))
      );

      await Promise.all(uploadPromises);
    } catch (e) {
      console.error("Fail to delete file", e);
    } finally {
      return;
    }
  }

  private extractKeyFromUrl(filePath: string): string {
    const bucketName = process.env.R2_BUCKET_NAME!;
    const accountId = process.env.R2_ACCOUNT_ID!;

    if (!filePath.startsWith(this.devUrl)) {
      throw new Error(`Invalid R2 file path: ${filePath}`);
    }

    return filePath.substring(this.devUrl.length);
  }
}
