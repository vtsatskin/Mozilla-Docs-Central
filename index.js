/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');

var fs = require("fs");
var mkdirp = require('mkdirp');

/**
 * Application configuration
 */

app.use(bodyParser.json());

// log requests
app.use(logger('dev'));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');


/**
 * Application routes
 */

app.get("/", function(req, res, next) {
  res.send(products);
});

app.post('/doc/register', function(req, res, next) {
  console.log("Got a /doc/register request");
  console.log("Payload:", req.body);
  var config = req.body.config;
  var github_remote = req.body.github_remote;

  registerDoc(config, github_remote, function(doc) {
    console.log("Successfully registered doc:", doc.name);
    res.send(doc);
  });
});


/**
 * Shitty application logic
 */

var DOCS_STORE_PATH = "./data/docs.json"
mkdirp('data', function(err) {
  if (err) console.error(err);
});

var products = {};
retrieveObject(DOCS_STORE_PATH, function(err, obj) {
  products = obj;
});

function lookupDoc(product, component, name) {
  return products[product] &&
         products[product].components &&
         products[product].components[component] &&
         products[product].components[component].doc;
}

function registerDoc(config, github_remote, callback) {
  var productName = config.product;
  var componentName = config.component;
  var name = config.name;
  var doc = lookupDoc(productName, componentName, name);

  if(doc) {
    callback(doc);
  }
  else {
    var product = products[productName] || (products[productName] = {});
    var component = product[componentName] || (product[componentName] = {});
    doc = component[name] = config;
    doc.git = github_remote;
    doc.url = ghPagesUrl(github_remote);

    storeObject(products, DOCS_STORE_PATH);
    callback(doc);
  }
}

function ghPagesUrl(remoteUrl) {
  var segments = remoteUrl.split('/');
  var length = segments.length;
  var user = segments[length-2];
  // Removes trailing ".git" if applicible
  var repoName = segments[length-1].replace(/\.git$/, "");
  return "http://" + user + ".github.io/" + repoName;
}

function storeObject(obj, location, callback) {
  fs.writeFile( location, JSON.stringify(obj, null, 2), "utf8", callback);
}

function retrieveObject(location, callback) {
  fs.readFile(location, 'utf8', function(err, code) {
    if (err) return callback("error loading file" + err, {});
    try {
      callback(null, JSON.parse(code));
    }
    catch (e) {
      callback("Error parsing " + f + ": " + e);
    }
  });
}
app.listen(3000);
console.log('listening on port 3000');
