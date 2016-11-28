////var Git = require("nodegit");
var Mocha = require('mocha'),
      fs = require('fs'),
      path = require('path');
var pad = require('pad-left');
var readline = require('readline');
var deleteFolder =  require('./delete-folder');
var courseInfo = require('./api/course');
var studentinfo = {
  numberOfStudents:0,
  students:[]

};

process.setMaxListeners(0);

var pathToTestFile = 'apps/05Mastermind.js';

var completed = [];
var githuburl = 'https://github.com/';
var localrepositorydirectory = './student1';
var dirs = getDirectories(localrepositorydirectory);
var numberOfDirs = dirs.length;

process.setMaxListeners(0);
main();
//get a list of all directoriers in the main directory

function main(){
    
    var dir = dirs.pop();
    fix(dir,done);
    
    
}
function fix(dir,done){
   
    var testDir = localrepositorydirectory + '/' + dir + '/' ;
    var fullpath = path.join(testDir, pathToTestFile)

    fs.readFile(fullpath, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
         data = data.replace('var colors = require(\'colors/safe\');','');
         data = data.replace('var colors = require(\'colors\');','');
         data = data.replace('var prompt = require(\'prompt\');','');

         var options = { flag : 'w' };
        fs.writeFile(fullpath, data, options, function(err) {
            if (err) throw err;
            console.log('file saved');
            done();
        });

    });

  


}
function done(student){
    if(student)
        completed.push(student);   
    if(dirs.length > 0){
       main();
    }
}
function addTestByDirectory(){

    fs.readdirSync(testDir).filter(function(file){
      // Only keep the .js files
      return file.substr(-3) === '.js';

    }).forEach(function(file){
        mocha.addFile(
            path.join(testDir, file)
        );
    });
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}


