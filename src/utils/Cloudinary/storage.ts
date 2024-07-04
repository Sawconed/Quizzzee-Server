import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const Params = {
  folder: "Quizzze_Profile",
  allowed_formats: ["jpg", "png", "jpeg", "gif"],
}

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    ...Params,
  } as typeof Params,
});
