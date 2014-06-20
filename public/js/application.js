$(function() {
  'use strict';

  var env = process.NODE_ENV;

  var templates = {
    people: Handlebars.compile($("#people-template").html())
  };

  console.log('start' + env);
  console.log(process.NODE_ENV);

  var handleError = function(e) {
    console.log(e);
    $('.error.predefined').show();
  };

  var updatePeople = function() {
    $.ajax('/api/people', { method: 'GET' }).then(function (data) {
      $('#people').html(templates.people(data));
    }, handleError);
  };

  $('#add-person').click(function (event) {
    var inputs = $('#add-person-name').val().split(' ');
    console.log(inputs);
    var data = { firstName: inputs[0], lastName: inputs[1], address: inputs[2] };
    var options = { method: 'POST', data: data };
    var promise = $.ajax('/api/people', options);
    promise.then(updatePeople, handleError);
    return false;
  });

  $(document).on('click', '.person-delete', function() {
    var $this = $(this);
    var id = $this.data('id');
    console.log(id);
    var options = { method: 'DELETE' };
    var url = '/api/people/' + id;
    var promise = $.ajax(url, options);
    promise.then(updatePeople, handleError);
    return false;
  });
  updatePeople();
});
