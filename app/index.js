const fs = require('fs');
const http = require('http');
const url = require('url');
// const BrainJSClassifier = require('natural-brain');
// const classifier = new BrainJSClassifier();
var natural = require('natural');
var classifier = new natural.BayesClassifier();

var trainingsFiles = fs.readdirSync('./train');

trainingsFiles.forEach((trainfile) => {
  let trainings = JSON.parse(fs.readFileSync('./train/'+trainfile, 'utf8'));
  trainings.forEach((train) => classifier.addDocument(train.question, train.result))
})
classifier.train();

// console.log(classifier.classify('me diz onde ta o carro HAD1233')); // -> ponto de referencia
// console.log(classifier.classify('quando o meu carro vai chegar no destino')); // -> destino

const server = http.createServer((req, res) => {
  let urlParse = url.parse(req.url,true);
  if (urlParse.pathname == '/pergunta') {
    // console.log(urlParse.query);
    // console.log({natural: natural.PorterStemmerPt.stem(urlParse.query.q)});
    if (urlParse.query.q) {
      // console.log(classifier.getClassifications(urlParse.query.q));
      res.end(JSON.stringify(classifier.classify(urlParse.query.q)));
    } else {
      res.end('pergunta');
    }
  } else {
    res.end('...');
  }
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(3000);
