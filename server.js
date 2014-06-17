var express = require('express');
var app = express();
var _ = require('lodash');

app.use(require('morgan')('dev'));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));


var people = {
  1: { id: 1, name: 'Adam' },
  2: { id: 2, name: 'Ariel' },
  3: { id: 3, name: 'Sam' },
  4: { id: 4, name: 'Grant' }
};

var idCache = _.keys(people);

var findUniqueKey = function (array) {
  var nextUnique = 1;

  var iterate = function (array) {
    if (array.indexOf(nextUnique.toString()) !== -1) {
      nextUnique += 1;
      iterate(array);
    }
    else {return nextUnique;}
  };

  iterate(array);
  idCache.push(nextUnique.toString());
  return nextUnique;
};

app.get('/api/people', function (req, res) {
  res.json({people: _.values(people)});
});

app.get(/^\/api\/people\/(\d+)$/, function (req, res) {
  var id = req.params[0];
  res.json({person: people[id]});
});

app.post('/api/people', function (req, res) {
  var id = findUniqueKey(idCache);
  var person = {
    id: id,
    name: req.param('name')
  };
  people[id] = person;
  res.json({ person: person });
});

app.put(/^\/api\/people\/(\d+)$/, function (req, res) {
  var id = req.params[0];
  people[id] = {id: id, name: req.param('name')};
  res.json({person: people[id]});
});

app.delete(/^\/api\/people\/(\d+)$/, function (req, res) {
  var id = req.params[0];
  delete people[id];
  res.json({people: _.values(people)});
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
