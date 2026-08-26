"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_service_1 = require("../../config/config.service");
cloudinary_1.v2.config({
    cloud_name: "dzxgpgrv3",
    api_key: "949476948875325",
    api_secret: config_service_1.API_SECRET,
});
exports.default = cloudinary_1.v2;
