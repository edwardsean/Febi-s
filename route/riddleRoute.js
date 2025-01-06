import express from "express";
import {db} from "../index.js";
import { resolveInclude } from "ejs";

const router = express.Router();

async function getAnswer(answer) {
    try {
        const response = await db.query("SELECT * FROM riddle WHERE answer = $1",
            [answer]
        );
        console.log(answer, response.rows[0].answer);
        return true;
    } catch (err) {
        return false;
    }
}

router.get("/", async (req, res) => {
    try{
        const riddle = await db.query("SELECT riddlePass FROM riddle");
        console.log("riddle rows: ",riddle.rows);
        res.json(riddle.rows);
    } catch(err) {
        res.status(500).json({message : "Unable to fetch riddle"});
    }
    
});

router.post("/enter", async (req, res) => { 
    const input = req.body.password,
    answer = await getAnswer(input.toLowerCase());
    if(answer) {
        res.json({success : true});
    } else {
        res.json({success : false});
    }
    
});

router.get("/add-riddle", (req, res) => {
    res.render("partials/addRiddle.ejs");
});

router.post("/submitRiddle", async (req, res) => {
    const riddleinput = req.body.riddle,
    answerinput = req.body.answer;

    try{
        await db.query("INSERT INTO riddle (riddlePass, answer) VALUES($1, $2)",
            [riddleinput, answerinput]
        );
        res.redirect("/");
    } catch(err) {
        res.status(500).json({message : "Unable to insert riddle and answer"});
    }
});

export default router;