export async function getUnsplashImage(query: string) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error("Unsplash Access Key not found in environment variables.");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${accessKey}`
    );
    const data = await response.json();
    return data.urls?.regular || null;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
}
