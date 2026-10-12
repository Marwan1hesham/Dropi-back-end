import { v2 as cloudinary } from "cloudinary";
import { API_SECRET } from "../../config/config.service";

cloudinary.config({
  cloud_name: "dzxgpgrv3",
  api_key: "292657786283498",
  api_secret: API_SECRET!,
});

export default cloudinary;
