
var userapi = require('./api/user');

var user = null;
testGetUser();
function testGetUser(){
    userapi.get('57e2fdd833f52211001aa539').then(function(u){
        user = u;
        testUpdateUser(user);
    });

}
function testUpdateUser(user){
    userapi.getCsrfToken(user.id, updateUser);
}
function updateUser(token){
    user.github = 'jw56578';
    user.is_instructor = true;
    user.is_admin = true;
    userapi.update(user,token);
}