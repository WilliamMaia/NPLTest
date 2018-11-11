const fs = require('fs');
const http = require('http');
const url = require('url');

var natural = require('natural');
var classifier = new natural.BayesClassifier();

var trainingsFiles = fs.readdirSync('./train');

trainingsFiles.forEach((trainfile) => {
  let trainings = JSON.parse(fs.readFileSync('./train/'+trainfile, 'utf8'));
  trainings.forEach((train) => classifier.addDocument(train.question, train.result))
})
classifier.train();
// console.log(classifier.getClassifications(urlParse.query.q));
// res.end(JSON.stringify(classifier.classify(urlParse.query.q)));

const express = require('express')
  , bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get("/question", function (request, response) {
  response.send(JSON.stringify(classifier.classify(request.query.q)));
});

app.post("/train", function (request, response) {
  console.log('Incoming webhook: ' + JSON.stringify(request.body));
  response.sendStatus(200);
});

var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
