const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const upload = (file, folder) => {
  return new Promise((res, rej) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        res({
          public_id: result.public_id,
          url: result.url,
        });
      },
      {
        resource_type: "auto",
        folder: folder,
      }
    );
  });
};

module.exports = {
  cloudinary,
  upload,
};
