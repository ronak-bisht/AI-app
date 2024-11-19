import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


// Initialize R2 client
const r2 = new S3Client({
    region: "auto",
    endpoint: "https://550927dd96f3cdcee4b20ddf6202c2db.r2.cloudflarestorage.com",
    credentials: {
      accessKeyId: "e28036b7cf54642acb140848d5c437a2",
      secretAccessKey: "3f39f54a6e74ad949608e29d1499444b2710df334406d01335ff440b6fa00bff",
    },
  });

export const uploadImage = async (imageBuffer: Buffer, imageName: string): Promise<string> => {
  try {
    const command = new PutObjectCommand({
        Bucket: "shopify",
        Key: imageName,
        Body: imageBuffer,
        ContentType: "image/png",
      });

    // Use putObject instead of presigned URL for direct upload
    await r2.send(command);
    
    // Return the public URL of the uploaded image
   return `https://pub-0ae2a8f797e84fae8911ca82cf00112d.r2.dev/${imageName}`;
  } catch (error) {
    console.error("R2 upload error:", error);
    throw new Error("Failed to upload image to R2");
  }
};