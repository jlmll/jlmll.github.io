$.getJSON('correlation.json', function(json) {
  var moca = json['moca'];
  var benton = json['benton'];
  var hvlt = json['hvlt'];

  var columnAname = 'moca';
  var columnBname = 'benton';
  var columnAdata = moca;

  var categoriesA = Object.keys(columnAdata[columnBname]);
  var categoriesB = Object.keys(columnAdata[columnBname]['Abstraction']);
  console.log(categoriesB);
  var categories = [columnAname, columnBname];
  var relevantData = columnAdata[columnBname];
  var data = [];
  var iterator = [];
  categoriesA.forEach(function (d) {
    categoriesB.forEach(function (p) {
      iterator = [d, p, columnAdata[columnBname][d][p]];
      data.push(iterator);
    });
  });});
