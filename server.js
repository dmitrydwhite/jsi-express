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

app.get('/api/people', function (req, res) {
  res.json({people: _.values(people)});
});

app.get(/^\/api\/people\/(\d+)$/, function (req, res) {
  console.log(req.params[0]);
  var id = req.params[0];
  res.json({person: people[id]});
});

app.post('/api/people', function(req, res) {
  var id = people.length + 1;
  var person = {
    id: 1,
    name: req.param('name')
  };
  people[id] = person;
  res.json({ person: person });
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
