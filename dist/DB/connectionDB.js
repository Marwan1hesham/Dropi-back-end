"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnectionDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_service_1 = require("../config/config.service");
const checkConnectionDB = async () => {
    await mongoose_1.default
        .connect(config_service_1.MONGODB_URI)
        .then(() => {
        console.log(`Connected to the DB ${config_service_1.MONGODB_URI} successfully`);
    })
        .catch((error) => {
        console.log(`Failed to connect to the DB`);
        console.log(error);
    });
};
exports.checkConnectionDB = checkConnectionDB;
