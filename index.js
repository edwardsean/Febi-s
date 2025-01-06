import express from "express"
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import {dirname} from "path";
import { fileURLToPath } from "url";
//ROUTES
import diaryRoute from "./route/diaryRoute.js";
import riddleRoute from "./route/riddleRoute.js";

const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

//database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Febis",
    password: "SamsungEd123.",
    port: 5432,
  });

db.connect();
export {db} //export to routes


app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/diary", diaryRoute);
app.use("/riddles", riddleRoute);



//home
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/html/home.html");
});


// app.post("/enter", (req, res) => {
//     const input = req.body["password"]; //this is the password and riddle from home.js
//     const riddle = req.body["riddle"];
    

//     if(input === riddle) {
//         res.json({success : true});
//     } else{
//         res.json({success : false});
//     }
 
// });

//menu
app.get("/menu", (req,res) => {
    res.render("index.ejs");
});

app.get("/game", (req, res) => {
    res.render("partials/game.ejs");
})
//movies
app.get("/movie", async (req, res) => {
    // try {
    //     const response = await axios.get('https://imdb236.p.rapidapi.com/imdb/search', {
    //         params : 
    //         {
    //             originalTitle: 'mission',
    //             primaryTitle: 'mission',
    //             type: 'movie',
    //             genre: 'Action',
    //             sortField: 'id',
    //             sortOrder: 'ASC'
    //         },
    //         headers : 
    //         {
    //             'x-rapidapi-key': '7103bcefa9msh4c7934cb583b1c3p15b08ajsne419c7279313',
    //             'x-rapidapi-host': 'imdb236.p.rapidapi.com'
    //         }
    //     });
        
    //     const data = response.data.results;
    //     res.render("partials/movie.ejs", {movies : data});
        
        
    // } catch (error) {
    //     console.log(error.message);
    // }
    res.render("partials/movie.ejs");
    
});




app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
