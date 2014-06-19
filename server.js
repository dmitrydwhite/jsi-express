var express = require('express');
var app = express();
var _ = require('lodash');

var env = process.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

app.use(require('morgan')('dev'));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));


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
