const util = require("util");
const path = require("path");

const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  keyFilename: "./keys.json",
  projectId: "hand-held-419811",
});
const bucket = storage.bucket("handheldstudent");

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file, name) =>
  new Promise((resolve, reject) => {
    const { buffer } = file;

    const blob = bucket.file(name.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
      })
      .on("error", (error) => {
        console.log(error);
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

module.exports = { uploadImage };
