var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectID = require("mongodb").ObjectID;

app = express();
jsonParser = bodyParser.json();
url = "mongodb://localhost:27017";

app.use(express.static(__dirname + "/public"));

app.get("/api/posts", function (req, res) {

    mongoClient.connect(url, function (err, client) {
        var db = client.db("lab8");

        db.collection("post").find({}).sort({date: -1}).toArray(function (err, posts) {
            res.send(posts);
            client.close();
        });
    });
});

app.get("/api/posts/:id", function (req, res) {
    var id = new objectID(req.params.id);

    mongoClient.connect(url, function (err, client) {
        var db = client.db("lab8");

        db.collection("post").findOne({_id: id}, function (err, post) {
            if (err) return res.status(400).send();

            res.send(post);
            client.close();
        });
    });
});

// Search posts

app.get("/api/search/:postTitle", function (req, res) {
    var postTitle = req.params.postTitle;

    console.log(postTitle);

    mongoClient.connect(url, function (err, client) {
        var db = client.db("lab8");

        db.collection("post").find({title: new RegExp(postTitle)}).toArray( function (err, posts) {
            if (err) return res.status(400).send();

            res.send(posts);
            client.close();
        });
    });
});

app.post("/api/posts/", jsonParser, function (req, res) {
    console.log("POST METHOD!");

    if (!req.body) return res.sendStatus(400);

    var myTime = new Date();

    var postTitle = req.body.title;
    var postText = req.body.text;
    var postDate = myTime.toTimeString();
    var post = {
        title: postTitle,
        text: postText,
        date: postDate
    };

    mongoClient.connect(url, function (err, client) {
        var db = client.db("lab8");

        db.collection("post").insertOne(post, function (err, result) {
            if (err) return res.status(400).send();

            res.send(post);
            client.close();
        })
    });
});

app.delete("/api/posts/:id", function (req, res) {
    var id = new objectID(req.params.id);

    mongoClient.connect(url, function (err, client) {
        var db = client.db("lab8");

        db.collection("post").findOneAndDelete({_id: id}, function (err, result) {
            if (err) return res.status(400).send();

            var post = result.value;
            res.send(post);
            client.close();
        })
    });
});

app.put("/api/posts/", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    console.log("PUT METHOD!");
    console.log(req.body);

    var myTime = new Date();

    var id = new objectID(req.body.id);
    var postTitle = req.body.title;
    var postText = req.body.text;
    var postDate = myTime.toTimeString();

    mongoClient.connect(url, function (err, client) {
        var db = client.db("lab8");

        db.collection("post").findOneAndUpdate({_id: id},
            {
                $set: {
                    title: postTitle,
                    text: postText,
                    date: postDate
                }
            },
            {returnOriginal: false}, function (err, result) {
                if (err) return res.status(400).send();

                var post = result.value;
                res.send(post);
                client.close();
            })
    });
});

app.listen(3000, function () {
    console.log("Server started");
});