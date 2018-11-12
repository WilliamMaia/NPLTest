const fs = require('fs');
const express = require('express')
, bodyParser = require('body-parser');

var natural = require('natural');
var classifier = new natural.BayesClassifier();

var trainingsFiles = fs.readdirSync('./train');

trainingsFiles.forEach((trainfile) => {
  let trainings = JSON.parse(fs.readFileSync('./train/'+trainfile, 'utf8'));
  trainings.forEach((train) => classifier.addDocument(train.question, JSON.stringify(train.result)))
})
classifier.train();
// console.log(classifier.getClassifications(urlParse.query.q));

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get("/question", function (request, response) {
  // console.log(JSON.parse(classifier.classify(request.query.q)));
  response.send(classifier.classify(request.query.q));
});

app.post("/train", function (request, response) {
  // console.log('Incoming webhook: ' + JSON.stringify(request.body));
  try{
    let date = new Date();
    fs.writeFileSync('./train/'+('train'+date.toISOString())+'.json', request.body.trainings);
  }catch (e){
    console.log("Cannot write file ", e);
  }
  response.sendStatus(200);
});

app.get("/", function (request, response) {
  let options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  response.sendFile('index.html', options);
});

var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
