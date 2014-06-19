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

var People = bookshelf.Model.extend({
  tableName: 'people'
});

app.get('/api/people', function (req, res) {
  People.fetchAll().then(function(result) {
    res.json({people: result.toJSON()});
  })
  .done();
});

app.get('/api/people/:id', function (req, res) {
  People.where({id: req.params.id}).fetchAll().then(function(result) {
    res.json({person: result.toJSON()});
  })
  .done();
});

app.post('/api/people', function (req, res) {
  People.forge({firstName: req.param('firstName'),
    lastName: req.param('lastName'), address: req.param('address')})
    .save().then(function(result) {
      res.json({created: result.toJSON()})
    })
    .done();
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
