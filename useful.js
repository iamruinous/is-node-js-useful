require.paths.unshift('./node_modules')

var express = require('express');
var app = express.createServer();

app.set('view engine', 'jade');

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(app.router);
    app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.get('/', function(req, res){
    res.render('index');
});

app.post ('/check.:format?', function(req, res){
    res.render('no');
});

app.listen(3000);