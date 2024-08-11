const express = require("express");
const path = require("path");
const multer = require("multer");
const Client = require("@replit/database").default;

const app = express();
const port = process.env.PORT || 3000;
const { uploadImage } = require("./uploadHelper.js");

// Set up static file serving from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
});
console.log(Client);
const client = new Client();

// API endpoint for listing the current images
app.get("/api/listPosts", async (req, res) => {
  let urls = (await client.get("uploaded_file_urls")).value;
  if (urls === undefined) {
    urls = [];
  }

  // must convert array to a JSON string before sending as http
  res.status(200).contentType("text/json").end(JSON.stringify(urls));
});
// API endpoint for uploading an image

app.post(
  "/api/uploadImage",
  upload.single(
    "image-upload" /* name attribute of <file> element in your form */,
  ),
  async (req, res) => {
    // make up a file name for our file by making a random string
    const uuid = Math.random().toString().slice(2, 12);
    try {
      //upload our file to cloud storage
      console.log(req.file.originalname);
      let imageUrl = await uploadImage(
        req.file,
        uuid + "-" + req.file.originalname + ".png",
      );

      // get the current list of images as a string, from the replit db
      // uploaded_file_urls is the key we store our list of urls in.
      let urlsJson = await client.get("uploaded_file_urls");
      if (urlsJson.value == undefined) {
        // use empty array if it doesn't exist
        urlsJson.value = [];
      }
      console.log(urlsJson);

      //parse that string as json
      let currentUrls = urlsJson.value;
      //add the new url to the list
      currentUrls.push(imageUrl);
      // stringify the list of urls and store it back into the replit db
      await client.set("uploaded_file_urls", currentUrls);

      res.status(200).contentType("text/json").end();
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
    }
  },
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// API endpoint for deleting an image post
app.delete("/api/deletePost/:index", async (req, res) => {
  const index = parseInt(req.params.index);
  if (isNaN(index)) {
    return res.status(400).send("Invalid index");
  }

  try {
    // Get the current list of URLs
    let urlsJson = await client.get("uploaded_file_urls");
    if (!urlsJson || !Array.isArray(urlsJson)) {
      return res.status(404).send("No posts found");
    }

    // Check if the index is within the range of the array
    if (index < 0 || index >= urlsJson.length) {
      return res.status(404).send("Post not found");
    }

    // Remove the post at the specified index
    urlsJson.splice(index, 1);

    // Update the database with the new list of URLs
    await client.set("uploaded_file_urls", urlsJson);

    // Respond to the client
    res.status(200).send("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Failed to delete post");
  }
});
