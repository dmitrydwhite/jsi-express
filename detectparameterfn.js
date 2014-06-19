var detectParameters = function (obj) {
  var array = _.pairs(obj);
  var returnObj = {};
  array.forEach(function (parameterSet) {
      obj.parameterSet[0] = parameterSet[1];
  });
  return obj;
};
