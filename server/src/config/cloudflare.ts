import { S3Client } from "@aws-sdk/client-s3";

class CloudflareR2 {
  private static _instance: S3Client;

  private static readonly R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
  private static readonly R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
  private static readonly R2_SECRET_ACCESS_KEY =
    process.env.R2_SECRET_ACCESS_KEY;

  private constructor() {}

  public static getInstance(): S3Client {
    if (!CloudflareR2._instance) {
      if (
        !this.R2_ACCOUNT_ID ||
        !this.R2_ACCESS_KEY_ID ||
        !this.R2_SECRET_ACCESS_KEY
      ) {
        throw new Error(
          "Missing required R2 environment variables (ACCOUNT_ID, ACCESS_KEY_ID, SECRET_ACCESS_KEY)"
        );
      }

      CloudflareR2._instance = new S3Client({
        region: "auto",
        endpoint: `https://${this.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: this.R2_ACCESS_KEY_ID,
          secretAccessKey: this.R2_SECRET_ACCESS_KEY,
        },
      });
    }

    return CloudflareR2._instance;
  }
}

export default CloudflareR2;
