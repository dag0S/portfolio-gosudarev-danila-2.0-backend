"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4321;
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", routes_1.default);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
