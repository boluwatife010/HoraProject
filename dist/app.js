"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("./src/auth/passport"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const userroute_1 = __importDefault(require("./src/routers/userroute"));
const taskroute_1 = __importDefault(require("./src/routers/taskroute"));
const authroute_1 = __importDefault(require("./src/routers/authroute"));
const grouproute_1 = __importDefault(require("./src/routers/grouproute"));
const db_1 = __importDefault(require("./db"));
const notificationrouter_1 = __importDefault(require("./src/routers/notificationrouter"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || ' ',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, db_1.default)();
const PORT = process.env.PORT || 8090;
app.use('/user', userroute_1.default);
app.use('/task', taskroute_1.default);
app.use('/group', grouproute_1.default);
app.use('/api', notificationrouter_1.default);
app.use('/api/auth', authroute_1.default);
app.listen(PORT, async () => {
    console.log('Server is running at port 8090.');
});
