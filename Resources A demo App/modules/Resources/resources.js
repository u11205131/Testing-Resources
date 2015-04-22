 var database = require('database');

exports = module.exports = function(database) {

var mongoose = require('mongoose');

var schemas = require('./schemas.js')(mongoose);

var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
	  // yay!
	});

var multer = require('multer');
var fs = require('fs');

var tempDir = './temp';
var maxSize = 16*1024*1024; //allowed by database
var constraints = {};

// defines and object resources
var resources = module.exports;

resources.uploadResources = function(files, relatedID, callback){
        var valid = false;
	    
	for(var i = 0; i < files.length; i++){

	var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);
	var res = C.find({"mime_type" : files[i].mimetype, "size_limit" : {$lte : files[i].size}});

	if(res.count()<=0) {
	    console.log('File Mime type or size not supported');
	    break;
	}
	var R = mongoose.model("Resources", schemas.resourceSchema);

	var r = new R;
	r.file_name = files[i].name;
	r.data = fs.readFileSync(files[i].path);
	r.size = files[i].size;
	r.hidden = false;
	r.related_id = relatedID;
	r.save(function(err){
	    if (err){
		callback(false);
	    } else {
		callback(true);
	    }
	});
    }
};

/**
     * TODO: This function is a mock function and returns all resources. Needs specified implementation.
     *
     * Retrieves resources specified by an array of resource IDs.
     * @param resIDs The array of resource IDs.
     * @param callback Receives the requested resources and an error object.
     */
    resources.getResourcesById = function(resIDs, callback){

        var R = mongoose.model("Resources", schemas.resourceSchema);

        R.find({'hidden' : false})
            .populate('_id', 'file_name')
            .exec(function(err, results){
                callback(err, results);
            });
    };

    /**
     * TODO: This function is a mock function and returns all resources. Needs specified implementation.
     *
     * Retrieves all resources for the specified buzz space.
     * @param spaceID The buzz space ID.
     * @param callback Receives the requested resources and an error object.
     */
    resources.getResourcesBySpaceId = function(spaceID, callback){

        var R = mongoose.model("Resources", schemas.resourceSchema);

        R.find({'hidden' : false})
            .populate('_id', 'file_name')
            .exec(function(err, results){
                callback(err, results);
            });
    };

    /**
     * TODO: This function is a mock function and returns all resources. Needs specified implementation.
     *
     * Retrieves all resources related to a thread or appraisal type.
     * @param relatedID The ID of the thread or appraisal type.
     * @param callback Receives the requested resources and an error object.
     */
    resources.getResourcesRelated = function(relatedID, callback){

        var R = mongoose.model("Resources", schemas.resourceSchema);

        R.find({'hidden' : false})
            .populate('_id', 'file_name')
            .exec(function(err, results){
                callback(err, results);
            });
    };


    /**
     * Returns all the resources in the database.
     * @param callback Receives the requested resources and an error object.
     */
    resources.getResourcesAll = function(callback){

        var R = mongoose.model("Resources", schemas.resourceSchema);

        R.find({'hidden' : false})
            .populate('_id', 'file_name')
            .exec(function(err, results){
                callback(err, results);
            });
    };

    /**
     * Locates and logically removes the indicated resource, if possible.
     *
     * @param resourceID The id of the resource to be removed.
     * @param callback The callback function receives a success value based on the success
     * of the addition.
     */
    resources.removeResource = function (resourceID, callback) {

        var R = mongoose.model('Resources', schemas.resourceSchema);

        R.findOneAndUpdate({'_id': resourceID}, {'hidden': true}, function (err) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

/**
 * PRIVATE: This function is not exported.
 *
 * Validates the MIME type of the file and sets max file size for that MIME type.
 *
 * @param mimeType The MIME type to be validated.
 * @returns {boolean} True if MIME type is allowed, else false.
 */
checkMimeType = function(mimeType){

    for (var i = 0; i < constraints.length; i++){
        if (constraints[i].mime_type === mimeType){
            return true;
        }
    }

    return false;
};

/**
 * This function gets all the resource constraints from the database.
 *
 * @param callback The callback function receives a err object and a
 * query object containing the results from the Resource_Constraints collection.
 */
resources.getConstraints = function(callback){

    var C = mongoose.model("Resource_Constraints", schemas.constraintSchema);

    C.find({}, function(err, results){
        callback(err, results);
    });
};

/**
 * Adds a new constraint to the Resource_Constraints collection in the database.
 *
 * @param mimeType The new MIME type.
 * @param sizeLimit The size limit for the MIME type.
 * @param callback The callback function receives a success value based on the success
 * of the addition.
 */
resources.addConstraint = function(mimeType, sizeLimit, callback){

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);
    var c = new C;

    c.mime_type = mimeType;
    c.size_limit = sizeLimit;
    c.save(function(err){
        if (err){
            callback(false);
        } else {
            callback(true);
        }
    });
};

/**
 * Removes a constraint from the Resource_Constraints collection.
 *
 * PRE-CONDITION: The objectID must conform to a hexadecimal sequence. If the objectID
 * specified is not hexadecimal, the function returns false.
 *
 * @param objectID The ID of the constraint to be removed.
 * @param callback The callback function receives a success value based on the success
 * of the remove query.
 */
resources.removeConstraint = function(objectID, callback){

    var pattern = /[a-f0-9]{24}/;
    if (!pattern.test(objectID)){
        callback(false);
        return;
    }

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

    C.findOneAndRemove({'_id' : objectID}, function(err){
        if (err){
            callback(false);
        } else {
            callback(true);
        }
    });
};

/**
 * Updates the specified constraint with a new size limit.
 *
 * @param constraintID The ID of the constraint to be updated.
 * @param sizeLimit The new size limit of the constraint.
 * @param callback The callback function receives a success value based on the success
 * of the update query.
 */
resources.updateConstraint = function(constraintID, sizeLimit, callback){

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

    C.findOneAndUpdate({'_id' : constraintID}, {'size_limit' : sizeLimit}, function(err){
        if (err){
            callback(false);
        } else {
            callback(true);
        }
    });
};

	return resources;
};

exports['@singleton'] = true;