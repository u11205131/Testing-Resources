var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var urlencodedparser = bodyparser.urlencoded({extended:false});
var resources = require('../modules/Resources/resources.js');

var multer = require('multer');

var Ioc = require('electrolyte');
Ioc.loader(Ioc.node('./modules/Resources'));
var db = Ioc.create('resources');

//require module
///Get obejcts from module

/* GET home page. */
router.get('/', function(req, res, next) {
//Pass to page
  res.render('index', { title: 'Resources A Testing' });
});
 

//Eg use get arguments from URL
router.get('/testing', function(req, res, next) {
//Pass to page
  res.render('test', getProfile(req.query.id));
});

// loads test page for DEMO
router.get('/testPost', function(req, res, next){

    res.render('dynamic_views/postInput', {
        success : ""
    });
});

// loads manage constraints page
router.get('/manageConstraints', function(req, res, next){

    resources.getConstraints(function(err, results){
        if (err){
            var html = "<p>Could not retrieve requested information from the database.</p>"
        } else {
            html = "<table><tr><td>Mime Type</td><td>File Size Limit</td></tr>\r\n";
            results.forEach(function(con){
                html += "<tr><td>"+con.mime_type+
                "</td><td>"+Math.round(con.size_limit/(1024*1024))+
                " MB</td><td><a href='/removeConstraint/"+con._id+"'>remove</a></td></tr>\r\n";
            });
            html += "</table>";
            res.render('dynamic_views/constraintsManagement', { results:  html});
        }
    });
});

// add constraint page
router.get('/addConstraint', function(req, res, next){

    res.render('dynamic_views/addConstraint', {
        success : ""
    });
});

// remove constraint from database
router.get('/removeConstraint/*', function(req, res, next){

    var id = req.url.replace('/removeConstraint/', "");
    resources.removeConstraint(id, function(truth){
        if (!truth){
                res.render('dynamic_views/constraintsManagement', {
                    results: "An error occurred!"
                });
        } else {
            resources.getConstraints(function(err, results){
                if (err){
                    var html = "<p>Could not retrieve requested information from the database.</p>";
                } else {
                    html = "<table><tr><td>Mime Type</td><td>File Size Limit</td></tr>\r\n";
                    results.forEach(function(con){
                        html += "<tr><td>"+con.mime_type+
                        "</td><td>"+Math.round(con.size_limit/(1024*1024))+
                        " MB</td><td><a href='/removeConstraint/"+con._id+"'>remove</a></td></tr>\r\n";
                    });
                    html += "</table>";
                    res.render('dynamic_views/constraintsManagement', { results:  html});
                }
            });
        }
    });
});

// adds a new constraint
router.post('/submitConstraint', urlencodedparser, function(req, res, next){

    resources.addConstraint(req.body.mime_type, req.body.size_limit, function(truth){
        if (!truth){
            res.render('dynamic_views/constraintsManagement', {
                results: "An error occurred!"
            });
        } else {
            resources.getConstraints(function(err, results){
                if (err){
                    var html = "<p>Could not retrieve requested information from the database.</p>"
                } else {
                    html = "<table><tr><td>Mime Type</td><td>File Size Limit</td></tr>\r\n";
                    results.forEach(function(con){
                        html += "<tr><td>"+con.mime_type+
                        "</td><td>"+Math.round(con.size_limit/(1024*1024))+
                        " MB</td><td><a href='/removeConstraint/"+con._id+"'>remove</a></td></tr>\r\n";
                    });
                    html += "</table>";
                    res.render('dynamic_views/constraintsManagement', { results:  html});
                }
            });
        }
    });
});

// upload a new file
//~ router.post('/submitPost', [ function(req, res, next){

    //~ resources.uploadResources(req, res, next, 0);
//~ }, function(truth) {
        //~ if (!truth)
	    //~ res.end("File not uploaded to db.");
        //~ else
            //~ res.end("File uploaded to db.");
    //~ }]);

//~ router.post('/submitPost', [ function(req, res, next){

    //~ resources.uploadFile(req, res, next, 0);
//~ }, function(req, res, next){
    //~ res.render('dynamic_views/postInput', {
        //~ success : res.fileState
    //~ });
//~ }]);

//~ router.use(multer({
    //~ dest: './uploads',
    //~ rename: function(fieldname,filename){
        //~ return filename + Date.now();
    //~ },
   //~ putSingleFilesInArray : true
//~ }));

//~ router.post('/submitPost',function(req,res){
    //~ console.log(req.files['resource']);
   //~ db.uploadResources(req.files['resource'],1,function(truth) {
        //~ if (!truth)
	    //~ res.end("File not uploaded to db.");
        //~ else
	   //~ {
            //~ ////~ res.end("File uploaded to db.");
		   //~ res.render('dynamic_views/postInput');
	   //~ }
    //~ });
//~ });

module.exports = router;
