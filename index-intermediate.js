var Git = require("nodegit");
var Mocha = require('mocha'),
      fs = require('fs'),
      path = require('path');

var studentAccountNames = require('./student-account-names');
var deleteFolder =  require('./delete-folder');

var iwb = {
  repo:'intermediate-workbook',
  studentAccounts:[],
  currentAccount:'',
  processed:0
}

var repos = [
  iwb
];

function fillStudents(homework){
  for(var s in studentAccountNames){
    homework.studentAccounts.push(studentAccountNames[s]);
  }
  return homework;
}
/*

this setup for multiple repos is not working for some reason

 */


deleteFolder('./student');
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
    fs.writeFile('test.json', JSON.stringify(failures), function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });

    run(homework);

  });

}

