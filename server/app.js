"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.routes = void 0;
const cors_1 = __importDefault(require("cors"));
exports.routes = express_1.default.Router();
exports.app = (0, express_1.default)();
const express_1 = __importDefault(require("express"));
const optCors = (cors_1.default.getCorsOptions = {
    origin: "http://localhost:4200",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
});
exports.app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});
exports.app.use((0, cors_1.default)(optCors));
exports.app.use(exports.routes);
//# sourceMappingURL=app.js.map