import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from './mongodb/connect.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import {register} from "./controller/auth.js";
import {createPost} from "./controller/post.js";
import { verifyToken } from "./middleware/auth.js";


// configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const PORT =process.env.PORT||6001;

// file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Routes with files
app.post("/auth/register",upload.single("picture"),register);
app.post("/post",verifyToken,upload.single("picture"),createPost);


// Routes 

app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);
//app.use("/chat",chatRoutes)


// connection with mongodb
const startServer = async () => {
  try {
    connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
startServer();
