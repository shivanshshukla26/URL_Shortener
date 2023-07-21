const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.json());
app.use(cors());

let db;

MongoClient.connect('mongodb+srv://shukla26shivansh:hello@cluster0.7d26wjn.mongodb.net/?retryWrites=true&w=majority').then((client) => {
    db = client.db('URL-shortner'); 
    console.log("DB server is connected");
}).catch((err) => {
    console.log(err);
})

app.get("/all", async (req, res) => {
    Url.find((error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    });
});

app.post("/short", async (req, res) => {
    console.log("HERE",req.body.url);
    const { origUrl } = req.body;
    const base = `http://localhost:3001`;
  
    const urlId = shortid.generate();
    if (utils.validateUrl(origUrl)) {
      try {
        let url = await Url.findOne({ origUrl });
        if (url) {
          res.json(url);
        } else {
          const shortUrl = `${base}/${urlId}`;
  
          url = new Url({
            origUrl,
            shortUrl,
            urlId,
            date: new Date(),
          });
  
          await url.save();
          res.json(url);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json('Server Error');
      }
    } else {
      res.status(400).json('Invalid Original Url');
    }
});
  
app.get("/:urlId", async (req, res) => {
    try {
      const url = await Url.findOne({ urlId: req.params.urlId });
      console.log(url)
      if (url) {
        url.clicks++;
        url.save();
        return res.redirect(url.origUrl);
      } else res.status(404).json("Not found");
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
});


const port = 3001;
app.listen(port, () => {
    console.log(`server is running in port ${port}`);
});