var Git = require("nodegit");
var Mocha = require('mocha'),
      fs = require('fs'),
      path = require('path');
var studentAccountNames = require('./student-account-names');
var deleteFolder =  require('./delete-folder');
var courseInfo = require('./course-info');

var jswb = {
  repo:'javascript-workbook',
  studentAccounts:[],
  currentAccount:'',
  processed:0
};

var iwb = {
  repo:'intermediate-workbook',
  studentAccounts:[],
  currentAccount:'',
  processed:0
}

var repos = [
  jswb,
  iwb
];


function fillStudents(homework){
  for(var s in studentAccountNames){
    homework.studentAccounts.push(studentAccountNames[s]);
  }
  return homework;
}

courseInfo.get().then(function(course){
  processStudents(course);
});


function processStudents(course){
  //find students that have github account from campus manager
  //find github accounts i manually accumulated and match to campus manager
  var students = course.registrations;
  var name = students[0].first_name //last_name;
  var github = students[0].github;

  //foreach student, has github account, has account that matches, has account that doesnt match
  var studentinfo = {
    numberOfStudents:0,
    students:[]

  };
  for(var s in students){
    var student = students[s];
    student = {
      github:student.github,
      hasMatch: studentAccountNames.indexOf(student.github) > -1,
      name:student.first_name + " " + student.last_name
    }
    studentinfo.students.push(student);
    studentinfo.numberOfStudents = studentinfo.students.length;
    studentinfo.numberOfStudentsWithoutGithub = studentinfo.students.filter((s)=>{s.github.length === 0}).length;
   

  }
  fs.writeFile('test.json', JSON.stringify(studentinfo), function (err) {
        if (err) return console.log(err);
  });


}
  //

return;



/*



3) create report of test results, all its doing is saying how any failures there are

 */



deleteFolder('./student');
fillStudents(jswb);
fillStudents(iwb);
runAll();


function runAll(){
  if(repos.length ===0)
    return;
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
  var url = 'https://github.com/' + homework.currentAccount + '/' + homework.repo;
  Git.Clone(url, './student/' + homework.currentAccount).then(function(repository) {
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


function runTests(homework){
  // Instantiate a Mocha instance.
  var mocha = new Mocha();
  var testDir = './student/' + homework.currentAccount + '/homework/' ;
  // Add each .js file to the mocha instance
  fs.readdirSync(testDir).filter(function(file){
      // Only keep the .js files
      return file.substr(-3) === '.js';

  }).forEach(function(file){
      mocha.addFile(
          path.join(testDir, file)
      );
  });

  // Run the tests.
  mocha.run(function(failures){
    //why won't it hit here'
    run(homework);

  });

}

