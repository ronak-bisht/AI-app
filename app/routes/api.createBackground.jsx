import { json } from "@remix-run/node";
import {uploadImage} from "../utils/imageUpload"
import axios from "axios";
import prisma from "../db.server";
export const action = async ({ request }) => {

  const data = await request.json();
  const { imageUrl, userId,theme } = data;

  if (!imageUrl || !userId) {
    return json({ error: "Image or user ID missing." }, { status: 400 });
  }

  // Generate a unique image name using the date and userId

  const imageName = `${Math.floor(Math.random() * 1000)}-${Date.now()}.png`;

  try {
  
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    // Define the Pebblely API URL and use an environment variable for your access token
    const apiUrl = 'https://api.pebblely.com/create-background/v2/';
    const apiKey = "a0a4c7a0-1f23-45c1-a284-4f004359bfca";

    // Send request to Pebblely API
    const pebblelyResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Pebblely-Access-Token': apiKey,
      },
      body: JSON.stringify({
        images: [base64Image],
        theme: theme || 'Surprise me',
      }),
    });
    
    if (!pebblelyResponse.ok) {
      const errorData = await pebblelyResponse.json();
      return json(errorData, { status: pebblelyResponse.status });
    }
    const pebblelyData = await pebblelyResponse.json();

    const bufferImage=Buffer.from(pebblelyData.data, 'base64');
    const uploadUrl=await uploadImage(bufferImage,imageName)

      // Step 3: Check if the user exists in the database
      let user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (user) {
        // User exists, update their assets array
        await prisma.user.update({
          where: { id: userId },
          data: {
            results: { push: imageName }, // Push the new imageName into the array
          },
        });
      } else {
        // User does not exist, create a new user
        await prisma.user.create({
          data: {
            id: userId,
            results: [imageName], // Initialize the assets array with the imageName
            assets: [], // Initialize an empty results array
          },
        });
      }
    return json({...pebblelyData,imageName,uploadUrl})
  } catch (error) {

    console.error("Error processing image:", error);
    return json({ error: "Failed to process the image" }, { status: 500 });
  }

};
