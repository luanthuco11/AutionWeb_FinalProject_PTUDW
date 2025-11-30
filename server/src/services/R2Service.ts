import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import CloudflareR2 from "../config/cloudflare";

export type R2DirectoryType = "product" | "user";

export class R2Service {
  private readonly r2Client = CloudflareR2.getInstance();
  private static _instance: R2Service;

  private constructor() {}

  static getInstance(): R2Service {
    if (!this._instance) {
      this._instance = new R2Service();
    }

    return this._instance;
  }

  public async uploadToR2(
    fileBuffer: Buffer,
    originalName: string,
    contentType: string,
    directory?: R2DirectoryType
  ): Promise<string> {
    let key = "";
    try {
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
      return key
        ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`
        : "";
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

  private extractKeyFromUrl(filePath: string): string {
    const bucketName = process.env.R2_BUCKET_NAME!;
    const accountId = process.env.R2_ACCOUNT_ID!;

    const baseUrl = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/`;

    if (!filePath.startsWith(baseUrl)) {
      throw new Error(`Invalid R2 file path: ${filePath}`);
    }

    return filePath.substring(baseUrl.length);
  }
}
