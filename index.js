import express from "express"
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;


app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");


//home
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/html/home.html");
});


app.post("/enter", (req, res) => {
    const input = req.body["password"];
    const riddle = req.body["riddle"];

    if(input === riddle) {
        res.json({success : true});
    } else{
        res.json({success : false});
    }
 
});

//menu
app.get("/index", (req,res) => {
    const choice = req.query.choice || "menu";
    const data = {
        choice : choice,
        page : choice === "menu" ? "menu" : choice
    };
    res.render("index", data);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
