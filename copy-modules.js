var ncp = require('ncp').ncp;
var Mocha = require('mocha'),
      fs = require('fs'),
      path = require('path');
 var fs = require('fs-extra')


ncp.limit = Infinity;
var completed = [];
var githuburl = 'https://github.com/';
var localrepositorydirectory = './student1';
var dirs = getDirectories(localrepositorydirectory);
var numberOfDirs = dirs.length;

process.setMaxListeners(0);
main();
//get a list of all directoriers in the main directory

function main(){
    if(dirs.length === 0)
        return;
    var dir = dirs.pop();

   
    try {
        fs.copySync('./node_modules',  localrepositorydirectory + '/' + dir + '/node_modules');
        console.log('done: ' + dir);
        main();
    } catch(e) {
        console.log(e);
    }

    /*
    ncp('./node_modules', localrepositorydirectory + '/' + dir + '/node_modules', function (err) {
        if (err) {
        return console.error(err);
        }
        console.log('done! ' + dir);
         main();
    });
   */
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}
