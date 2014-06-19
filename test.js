'use strict';

var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var People = bookshelf.Model.extend({
  tableName: 'people',
});

var population = process.argv.slice(2);

population.forEach(function (person) {
  People.forge({firstName: person}).save().done();
});

