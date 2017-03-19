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
var testResults = [];
var accountToRun = 'nickinwaco';
process.setMaxListeners(0);
var pathToTestFile = [
    'apps/01PigLatin.js',
    'apps/02RockPaperScissors.js',
    'apps/03TicTacToe.js',
    'apps/04TowersOfHanoi.js',
    'apps/05Mastermind.js',
    'apps/06SpaceTravelToMars.js',
    'apps/06.1Checkers.js',
    'apps/07jquery-tic-tac-toe/test.js',
    'apps/08jquery-towers-of-hanoi/test.js',
    'apps/09todo-jquery/test.js',
    'apps/10address-book-ajax/test.js',
    'homework/01Lessonone.js',
    'homework/02Lessontwo.js',
    'homework/03LessonThree.js',
    'homework/04LessonFour.js',
    'homework/05LessonFive.js',
    'homework/06LessonSix.js',
    'homework/07LessonSeven/test.js',
    'homework/08LessonEight/test.js'
    ]

var completed = [];
var githuburl = 'https://github.com/';
var localrepositorydirectory = './student1';
var dirs = localrepositorydirectory + '/' + accountToRun ;
var numberOfDirs = dirs.length;

process.setMaxListeners(0);
main();
//get a list of all directoriers in the main directory

function main(){
    runTests( accountToRun,done); 
}
function done(student){
    console.log(pad('project',50,' ') + " " + pad('score',7,' ') + " " +  pad('tests compiled',15,' ') );
    for(var i = 0; i < testResults.length; i ++){
        console.log(pad(testResults[i].test,50,' ')  + ": " + pad(testResults[i].score || '0',7,' ') + " "  );
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
  if(pathToTestFile.length === 0){
    done(homework.currentAccount);
    return;
  }
  var testpath = pathToTestFile.pop();
  mocha.addFile(
      path.join(testDir, testpath)
  );
  try{
    mocha.run(function(failures){

      homework.currentAccount.failures = failures;
      homework.currentAccount.score = ((homework.currentAccount.numberOfTests - homework.currentAccount.failures) / homework.currentAccount.numberOfTests) * 100;
      homework.currentAccount.testsFinishedRunning = true;
      testResults.push({
          score:homework.currentAccount.score,
          test:testpath
      });
      runTests(studentDirectory,done);
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
  catch(e){
    testResults.push({
        score:e.message,
        test:testpath
    });
     runTests(studentDirectory,done);
  }

}

