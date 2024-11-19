import { json } from "@remix-run/node";
import { uploadImage } from "../utils/imageUpload";
import axios from "axios";
import prisma from "../db.server"; // Ensure you correctly import Prisma client

export const action = async ({ request }) => {
  const data = await request.json();
  const { image, userId } = data;

  if (!image || !userId) {
    return json({ error: "Image or user ID missing." }, { status: 400 });
  }

  // Generate a unique image name using a random value and timestamp
  const imageName = `${Math.floor(Math.random() * 1000)}-${Date.now()}.png`;


  try {
    // Step 1: Send the image to the background removal API
    const removeBgResponse = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      { image_file_b64: image },
      {
        headers: {
          "X-Api-Key": "m1R6NG7jPdtFJCH6pTSLfXEx",
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    // Step 2: Upload the processed image to your storage (e.g., S3)
    const imageUrl = await uploadImage(removeBgResponse.data, imageName);

    // Step 3: Check if the user exists in the database
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      // User exists, update their assets array
      await prisma.user.update({
        where: { id: userId },
        data: {
          assets: { push: imageName }, // Push the new imageName into the array
        },
      });
    } else {
      // User does not exist, create a new user
      await prisma.user.create({
        data: {
          id: userId,
          assets: [imageName], // Initialize the assets array with the imageName
          results: [], // Initialize an empty results array
        },
      });
    }
    const resultImage = `data:image/png;base64,${Buffer.from(removeBgResponse.data).toString('base64')}`;
    return json({
      success: true,
      resultImage,
      imageUrl,
      imageName
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return json({ error: "Failed to process the image" }, { status: 500 });
  }
};
