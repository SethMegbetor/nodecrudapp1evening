//npm install nodemon --save-dev

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;

const uri =
  "mongodb+srv://admin:admin@cluster0.mjcql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  // const collection = client.db("test").collection("devices");

  if (err) return console.log(err);
  console.log("connected to mongo database");

  const db = client.db("crudeveningclass");
  const quotesCollection = db.collection("quotes");

  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(bodyParser.json());

  //body parser middleware
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/index.html");

    db.collection("quotes")
      .find()
      .toArray()
      .then((result) => {
        console.log(result);
        res.render("index.ejs", { quotes: result });
      })
      .catch((error) => console.error(error));
  });

  app.post("/quotes", (req, res) => {
    quotesCollection
      .insertOne(req.body)
      .then((result) => {
        console.log(result);
        res.redirect("/");
      })
      .catch((error) => console.error(error));
  });

  app.put("/quotes", (req, res) => {
    quotesCollection
      .findOneAndUpdate(
        { name: "monday" },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote,
          },
        },
        {
          upsert: true,
        }
      )
      .then((result) => {
        res.json("Success");
      })
      .catch((error) => console.error(error));
  });

  app.delete("/quotes", (req, res) => {
    // Handle delete event here

    quotesCollection
      .deleteOne({ name: req.body.name })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res.json("No quote to delete at the moment");
        }
        res.json(`Deleted mondays's quote`);
      })
      .catch((error) => console.error(error));
  });

  app.listen(3000, function () {
    console.log("listening on 3000");
  });
});

//npm install ejs --save
