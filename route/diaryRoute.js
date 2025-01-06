import express from "express";
import {db} from "../index.js";

const router = express.Router();

async function getDraft() {
    
    try{
        const response = await db.query("SELECT * FROM drafts");
        
        console.log(response.rows);
        return response.rows;
    } catch (err) {
        res.status(500).json({message : "Unable to fetch drafts"})
    }

}

async function getPost() {
    try{
        const response = await db.query("SELECT * FROM posts");
        return response.rows;
    } catch(err) {
        res.status(500).json({message : "Unable to fetch posts"})
    }
}

async function deleteDraft(id) {
    try{
        await db.query("DELETE FROM drafts WHERE id = $1", [id]);
        return;
    } catch (err) {
        res.status(500).json({message : "Unable to delete draft"});
    }
}

router.get("/", async (req, res) => {
    try {
        const getDrafts = await getDraft();
        const getPosts = await getPost();

        const noDraft = getDrafts.length === 0;
        const noPost = getPosts.length === 0;
        

        res.render("partials/diary.ejs", {
            drafts : getDrafts, 
            posts : getPosts,
            noDraft : noDraft,
            noPost : noPost
        });
    } catch (err) {
        console.log(err.message);
    }

   
});

router.get("/new", (req, res) => {
    res.render("new.ejs", {
        heading : "New Draft",
        submit : "Create Draft"
    });
}); 

router.post("/editDraft/:id", async (req, res) => {
    const editedTitle = req.body.title,
    editedContent = req.body.content,
    editedAuthor = req.body.author,
    date = req.body.time,
    id = parseInt(req.params.id);
    console.log(editedTitle, editedContent, editedAuthor, date);
    try {
        await db.query("UPDATE drafts SET title = $1, author = $2, contents = $3, date = $4 WHERE id = $5",
            [editedTitle, editedAuthor, editedContent, date, id]
        );
        res.redirect("/diary");
    } catch (err) {
        res.status(500).json({message : "Unable to edit draft"});
    }
});

router.get("/edit/:id", async (req, res) => {
    try {
        const getDrafts = await getDraft();
        const selected = getDrafts.find((draft) => draft.id == parseInt(req.params.id));
        console.log("SELECTED: ",selected);
        res.render("new.ejs", {
            draft : selected,
            heading : "Edit Draft",
            submit : "Finish Editing"
        });
    } catch (err) {
        res.status(500).json({message : "Unable to find draft"});
    }

});

router.get("/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await deleteDraft(id);
    res.redirect("/diary");
    // try{
    //     await db.query("DELETE FROM drafts WHERE id = $1", [id]);
    //     res.redirect("/diary");
    // } catch (err) {
    //     res.status(500).json({message : "Unable to delete draft"});
    // }
});

router.get("/post/:id", async (req, res) => {
    const id = parseInt(req.params.id);
   
    try{
      
        await db.query("INSERT INTO posts (title, author, contents, date, draft_id) SELECT title, author, contents, date, id FROM drafts WHERE id = $1",
           [id]
        );
   
        await db.query("DELETE FROM drafts WHERE id = $1", [id]); 
        
        res.redirect("/diary");
    } catch (err) {
        res.status(500).json({message : err.message});
    }
});

router.post("/postDraft", async (req, res) => {
    const content = req.body.content,
    title = req.body.title,
    author = req.body.author,
    date = req.body.time;
    console.log(content, title, author, date);
    try{
        await db.query("INSERT INTO drafts (title, author, contents, date) VALUES ($1, $2, $3, $4)",
            [title, author, content, date]
        );
        res.redirect("/diary");
    } catch (err) {
        res.status(500).json({message : "Unable to make draft"});
    }
}); 
export default router;