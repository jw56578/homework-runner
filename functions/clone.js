var Promise = require('Promise');

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

module.exports = clone;