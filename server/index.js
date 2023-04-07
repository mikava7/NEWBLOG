import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import {
	registerValidator,
	loginValidator,
	postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";

import { register, login, getMe } from "./controllers/UserController.js";
import {
	create,
	getAll,
	getOne,
	remove,
	update,
} from "./controllers/PostController.js";

import cors from "cors";
const app = express();
const port = 4444;
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads"); // set the correct path for the uploaded file
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
//exxpress vuxsnit rom surati ar aris routi,
// aramed es ari folder sadac inaxeba statikuri failebi
app.use("/uploads", express.static("uploads"));

const CONNECTION_STRING =
	"mongodb+srv://mikava365:irakli365@cluster0.z6h2hyj.mongodb.net/blogPost?retryWrites=true&w=majority";

mongoose
	.connect(CONNECTION_STRING)
	.then(() => console.log("DB has been connected"))
	.catch((error) => console.log("DB error", error));

//jer vaketebt validacias - registerValidator, mer vparsavt erorebze-handleValidationErrors
//da tu ar iqna erorebi vushvebt - register funqcias
app.post("/auth/register", registerValidator, handleValidationErrors, register);
app.post("/auth/login", loginValidator, handleValidationErrors, login);
app.get("/auth/me", checkAuth, getMe);

//rodesac request mova '/uploads/ gaeshveba upload.single("image")
// da tu sworia gaeshveba callback funqcia da daabrunebs misamarts
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	try {
		res.json({
			url: `/uploads/${req.file.originalname}`,
		});
	} catch (err) {
		console.log(error);
		res.send(400);
	}
});
app.use((req, res) => {
	console.log(req.pah);
});
app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	create
);
app.delete("/posts/:id", checkAuth, remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	update
);

app.listen(port, console.log(`server is listening to port:${port} `));
