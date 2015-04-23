/**
 * Created by commader on 2015/04/23.
 */
var test = require('unit.js');



var IoC = require('electrolyte');
IoC.loader(IoC.node('../node_modules'));
var buzzre = IoC.create('buzz-resources');

//console.log(buzzre);

describe(' testing of resource', function(){

    it('Buzz Status test 1', function(){

        buzzre.removeConstraint("552f9eec38d6d458332beef7",function(result){
            console.log(result+" elo");
        });
        console.log(" elo");

    });

    it('Buzz Status test 1', function(){

        buzzre.removeResource("552f9eec38d6d458332beef7",function(result){
            console.log(result+" elo");
        });
        console.log(" elo");

    });
    it('Buzz Status test 1', function(){

        buzzre.getConstraints(function(result){

            console.log(result+" Constraints")

        });

    });
    it('Buzz Status test 1', function(){

        buzzre.addConstraint(function(result)
        {
            console.log(result);
        });


    });
    it('Buzz Status test 1', function(){

        buzzre.updateConstraint("","",function(result)
        {
            console.log(result);
        });

    });
    it('Buzz Status test 1', function(){

        buzzre.updateConstraint("","",function(result)
        {
            console.log(result);
        });

    });

});