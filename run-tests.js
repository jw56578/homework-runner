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
//var pathToTestFile = 'apps/01PigLatin.js';
var pathToTestFile = 'homework/01Lessonone.js';
var pathToTestFile = 'homework/02Lessontwo.js';
var pathToTestFile = 'apps/02RockPaperScissors.js';
//var pathToTestFile = 'homework/03LessonThree.js';
//var pathToTestFile = 'apps/03TicTacToe.js';
//var pathToTestFile = 'homework/04LessonFour.js';
var pathToTestFile = 'homework/05LessonFive.js';
var pathToTestFile = 'apps/04TowersOfHanoi.js';
var pathToTestFile = 'apps/05Mastermind.js';
var pathToTestFile = 'homework/06LessonSix.js';
var pathToTestFile = 'apps/06SpaceTravelToMars.js';
var pathToTestFile = 'apps/06.1Checkers.js';
var pathToTestFile = 'homework/07LessonSeven/test.js';

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
    runTests(dir,done);
    
    
}
function done(student){
    if(student)
        completed.push(student);   
    if(dirs.length > 0){
       main();
    }
    if(completed.length ===numberOfDirs){
        console.log(pad('github',20,' ') + " " + pad('name',20,' ') + ": " + pad('score',7,' ') + " " +  pad('tests compiled',15,' ') );
        for(var c in completed){
            console.log(pad(completed[c].username,20,' ') + " " + pad(completed[c].username,20,' ') + ": " + pad(completed[c].score,7,' ') + " " + pad(completed[c].testsFinishedRunning,15,' ') );
        }
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

function runTests(studentDirectory,done){
  // Instantiate a Mocha instance.
  var homework = {
      currentAccount:{
          username:studentDirectory
      } 
  };
 
 
  var mocha = new Mocha();
  var testDir = localrepositorydirectory + '/' + homework.currentAccount.username + '/' ;
  homework.currentAccount.numberOfTests = 0;
  homework.currentAccount.failures = 0;
  homework.currentAccount.score = 0;
  homework.currentAccount.testsFinishedRunning = false;

  // Add each .js file to the mocha instance
  mocha.addFile(
      path.join(testDir, pathToTestFile)
  );

/*
  var failtimer = setTimeout(function(){
      done(homework.currentAccount);

  },4000);
*/
  
  try{
    mocha.run(function(failures){
      homework.currentAccount.failures = failures;
      homework.currentAccount.score = ((homework.currentAccount.numberOfTests - homework.currentAccount.failures) / homework.currentAccount.numberOfTests) * 100;
      homework.currentAccount.testsFinishedRunning = true;
      //clearTimeout(failtimer);
      done(homework.currentAccount);
    }).on('fail', function(test, err) {
    
    }).on('test', function(test) {
          homework.currentAccount.numberOfTests ++;
    }).on('end', function(t) {
      
    }).on('suite end', function(t) {
       //done(homework.currentAccount);
    }).on('test end', function(t) {
      
    }).on('pending', function(t) {
      
    });
  }


  /*
   `start`  execution started
 *   - `end`  execution complete
 *   - `suite`  (suite) test suite execution started
 *   - `suite end`  (suite) all tests (and sub-suites) have finished
 *   - `test`  (test) test execution started
 *   - `test end`  (test) test completed
 *   - `hook`  (hook) hook execution started
 *   - `hook end`  (hook) hook complete
 *   - `pass`  (test) test passed
 *   - `fail`  (test, err) test failed
 *   - `pending`  (test) test pending
  
   */
  catch(e){
    //clearTimeout(failtimer);
    done(homework.currentAccount);
  }

}

