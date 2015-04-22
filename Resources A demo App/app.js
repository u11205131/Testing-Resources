var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongo');
var routes = require('./routes/index');

var multer = require('multer');

var Ioc = require('electrolyte');
Ioc.loader(Ioc.node('./modules/Resources'));
var db = Ioc.create('resources');

var app = express();

app.use(multer({
    dest: './uploads',
    rename: function(fieldname,filename){
        return filename + Date.now();
    },
   putSingleFilesInArray : true
}));

app.post('/submitPost',function(req,res){
    console.log(req.files['resource']);
   db.uploadResources(req.files['resource'],1,function(truth) {
        if (!truth)
	    res.end("File not uploaded to db.");
        else
            res.end("File uploaded to db.");
    });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
