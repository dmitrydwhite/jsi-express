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

var detectParameters = function (obj) {
  var array = _.pairs(obj);
  var returnObj = {};
  array.forEach(function (parameterSet) {
      returnObj[parameterSet[0]] = parameterSet[1];
  });
  return returnObj;
};

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

app.put('/api/people/:id', function (req, res) {
  console.log(req.body);
  People.where({id: req.params.id}).fetch().then(function(person) {
    return person.save(detectParameters(req.body), {patch: true});
  }).then(function(person) {
    res.json({updated: person.toJSON()});
  })
  .done();
});

app.delete('/api/people/:id', function (req, res) {
  var destroyedPerson;
  People.where({id: req.params.id}).fetch().then(function(person) {
    destroyedPerson = person.clone();
    return person.destroy();
  }).then(function() {
    res.json({destroyed: destroyedPerson.toJSON()});
  })
  .done();
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
