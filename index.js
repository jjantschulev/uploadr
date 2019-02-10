const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);

const PORT = 4001;
const DATA_PATH = "./data/";

const app = express();
app.listen(PORT, () => console.log(`Uploader running on port ${PORT}`));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static("static"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/upload", async (req, res) => {
    try {
        if (!req.files) throw Error("No files submitted");
        for (let fileKey in req.files) {
            const p = path.join(__dirname, DATA_PATH, req.files[fileKey].name);
            await writeFile(p, req.files[fileKey].data);
        }
        res.send({ error: false, message: "Uploaded succesfully" });
    } catch (error) {
        res.send({ error: true, message: error.message });
    }
});
