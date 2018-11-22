var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs('whatever', ['things'])

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res) {
    res.send("It Works!");
});

app.get('/things', function (req, res) {
    db.things.find(function (err, docs) {
        if (err) {
            res.send(err);
        } else {
            console.log("Getting Things...");
            res.json(docs);
        }
       
    });
});

app.post('/things', function (req, res) {
    db.things.insert(req.body, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            console.log("Adding Thing...");
            res.json(doc);
        }

    });
});

app.put('/things/:id', function (req, res) {
    db.things.findAndModify({
        query: { _id: mongojs.ObjectId(req.params.id) }, 
        update: { 
            $set: {
                name: req.body.name,
                type: req.body.type,
                deadline: req.body.deadline}
        }, new: true }, function (err, doc) {
            if (err) {
                res.send(err);
            } else {
                console.log("Updating Thing...");
                res.json(doc);
            }
        });
});

app.delete('/things/:id', function (req, res) {
    db.things.remove({ _id: mongojs.ObjectId(req.params.id) }, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            console.log("Removing Thing...");
            res.json(doc);
        }

    });
});


app.listen(3000);
console.log("Running on port 3000...");