var fs = require('fs');

var file_read = fs.readFileSync('./cleaned_urls.txt').toString();

// console.log(arr)

var countries_list = [];
var t = file_read.split('\r\n');
for (var line in t) {
  countries_list.push(t[line].split(','));
}

console.log(countries_list, countries_list.length);

var d = {};

for (var u in countries_list) {
  var user = countries_list[u];

  for (var c in user) {
    var country = user[c];

    if (!(country in d)) {
      d[country] = 0;
    }

    d[country] += 1;
  }
}

console.log(d);

var frequency_map = {};
for (var key in d) {
  if (d[key] >= 3) {
    frequency_map[key] = d[key];
  }
}

console.log(frequency_map);

// frequency_map will be the countries targeted in the ML model
// Some countries with less data points will be excluded

var cleaned_dataset = [];
for (var u in countries_list) {
  var user = countries_list[u];
  var t = [];
  for (var c in user) {
    var country = user[c];
    if (country in frequency_map) {
      t.push(country);
    }
  }

  cleaned_dataset.push(t);
}

console.log(cleaned_dataset);
