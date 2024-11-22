import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


// Initialize R2 client
const r2 = new S3Client({
    region: "auto",
    endpoint:process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY || "",
      secretAccessKey: process.env.R2_SECRET_KEY || "",
    },
  });

export const uploadImage = async (imageBuffer: Buffer, imageName: string): Promise<string> => {
 
  try {
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: imageName,
        Body: imageBuffer,
        ContentType: "image/png",
      });

    // Use putObject instead of presigned URL for direct upload
    await r2.send(command);
    
    // Return the public URL of the uploaded image
   return `${process.env.IMAGE_URL}/${imageName}`;
  } catch (error) {
    console.error("R2 upload error:", error);
    throw new Error("Failed to upload image to R2");
  }
};