import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  // Validate input
  if (!userId) {
    return json({ error: "User ID is required." }, { status: 400 });
  }

  try {
    // Fetch assets from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },

    });

    if (!user) {
      return json({ error: "User not found." }, { status: 404 });
    }

    return json({ assets: user.assets,results:user.results }, { status: 200 });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return json({ error: "Failed to fetch assets." }, { status: 500 });
  }
};
