import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
const PORT = 8081;
const app = express();
app.listen(PORT, () => console.log(`Uploader running on port ${PORT}`));
app.use(bodyParser.json());
app.use(fileUpload());

app.get("/", (req, res) => {});

app.post("/upload", (req, res) => {});
