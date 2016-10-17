var Git = require("nodegit");
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
var pathToTestFile = 'homework/02LessonTwo.js';


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//delete physical files and pull down from github/
//set the path to what test needs to be run for
//run tests
rl.question(' Pull Repos 2) ', (answer) => {
  console.log( pigLatin(answer) );
  getPrompt();
});

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
  deleteFolder('./student');
  fillStudents(jswb);
  fillStudents(iwb);
  runAll();
}
function runAll(){
  if(repos.length ===0){
    for(var c in completed){
      console.log(pad(completed[c].github,20,' ') + " " + pad(completed[c].name,20,' ') + ": " + completed[c].failures );
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

  return clone(homework);
}
function getCurrentAccount(homework){
  homework.currentAccount = homework.studentAccounts.pop();
  return homework;
}


function clone(homework){
  homework = getCurrentAccount(homework);
  var url = 'https://github.com/' + homework.currentAccount.github + '/' + homework.repo;
  Git.Clone(url, './student/' + homework.currentAccount.github).then(function(repository) {
    // Work with the repository object here.
    //why is it not debugging to here
    //this won't work if the repository has already been cloned to the folder so you have to delete it each time'
    homework.processed ++;
    runTests(homework);
  }).catch(function(){
   run(homework);
  });
  return homework;
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

function runTests(homework){
  // Instantiate a Mocha instance.
  var mocha = new Mocha();
  var testDir = './student/' + homework.currentAccount.github + '/' ;
  homework.currentAccount.numberOfTests = 0;
  // Add each .js file to the mocha instance
  mocha.addFile(
      path.join(testDir, pathToTestFile)
  );
  // Run the tests.
  mocha.run(function(failures){
    //why won't it hit here'
    homework.currentAccount.score = ((homework.currentAccount.numberOfTests - homework.currentAccount.failuers) / homework.currentAccount.numberOfTests) * 100;
    homework.currentAccount.failures = failures;
    completed.push(homework.currentAccount);
    run(homework);

  }).on('fail', function(test, err) {
  
  }).on('test', function(test) {
        homework.currentAccount.numberOfTests ++;
  });

}

