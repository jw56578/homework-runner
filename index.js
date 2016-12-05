var Git = require("nodegit");
var Mocha = require('mocha'),
      fs = require('fs-extra'),
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
var pathToTestFile = 'homework/03LessonThree.js';
var pathToTestFile = 'apps/03TicTacToe.js';
//var pathToTestFile = 'homework/04LessonFour.js';

var githuburl = 'https://github.com/';
var localrepositorydirectory = './student1';


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//delete physical files and pull down from github/
//set the path to what test needs to be run for
//run tests
//rl.question(' Pull Repos 2) ', (answer) => {
  //console.log( pigLatin(answer) );
  //getPrompt();
//});

var jswb = {
  repo:'javascript-workbook',
  studentAccounts:[],
  currentAccount:'',
  processed:0,
  results:[]
};

var iwb = {
  repo:'intermediate-workbook',
  studentAccounts:[],
  currentAccount:'',
  processed:0,
  results:[]
}

var repos = [
  jswb,
  iwb
];
var completed = [];


function fillStudents(homework){
  for(var s in studentinfo.students){
    homework.studentAccounts.push(studentinfo.students[s]);
  }
  return homework;
}

courseInfo.get().then(function(course){
  processStudents(course);
});


function processStudents(course){

  var students = course.registrations;
  var name = students[0].first_name //last_name;
  var github = students[0].github;

  for(var s in students){
    var student = students[s];
    student = {
      github:student.github,
      name:student.first_name + " " + student.last_name,
      id:student.id
    }
    studentinfo.students.push(student);
    studentinfo.numberOfStudents = studentinfo.students.length;
    studentinfo.numberOfStudentsWithoutGithub = studentinfo.students.filter((s)=>{s.github.length === 0}).length;
  }
  main();
  fs.writeFile('test.json', JSON.stringify(studentinfo), function (err) {
        if (err) return console.log(err);
  });


}

/*
3) create report of test results, all its doing is saying how any failures there are

 */


function main(){
  //deleteFolder(localrepositorydirectory);
  fillStudents(jswb);
  fillStudents(iwb);
  runAll();
}
function runAll(){
  if(repos.length ===0){
    console.log(pad('github',20,' ') + " " + pad('name',20,' ') + ": " + pad('score',7,' ') + " " +  pad('tests compiled',15,' ') );
    for(var c in completed){
      console.log(pad(completed[c].github,20,' ') + " " + pad(completed[c].name,20,' ') + ": " + pad(completed[c].score,7,' ') + " " + pad(completed[c].testsFinishedRunning,15,' ') );
    }
    return;
  }
  var repo = repos.pop();
  run(repo);
}
function run(homework){
  if(homework.studentAccounts.length === 0)
  {
    runAll();
    console.log(homework.processed);
    return;
  }
  homework = getCurrentAccount(homework);
  //hack if don't want to download repos again
  //runTests(homework);
  
  return clone(homework);
}
function getCurrentAccount(homework){
  homework.currentAccount = homework.studentAccounts.pop();
  return homework;
}


function clone(homework){
  
  var url = githuburl + homework.currentAccount.github + '/' + homework.repo;
     //this won't work if the repository has already been cloned to the folder so you have to delete it each time'
    //this is making it take to long to install the node modules
    //change this to clone to a temp directory and then copy the files into the real folder where the node_modules are already installed
  var tempdirectory = localrepositorydirectory + '/' + homework.currentAccount.github + 'temp';
  Git.Clone(url, tempdirectory).then(function(repository) {
    try {
        fs.copySync(tempdirectory,  localrepositorydirectory + '/' + homework.currentAccount.github);
    } catch(e) {
        console.log(e);
    }
    deleteFolder(tempdirectory);
    homework.processed ++
    run(homework);

  }).catch(function(e){
   run(homework);
  });
  return homework;
}

