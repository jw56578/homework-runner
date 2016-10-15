var authCookies = require('./auth-cookies');
var request = require('request');
var Promise = require('Promise');

module.exports = {
    get:function(){
        var promise = new Promise(function (resolve, reject) {
            get(function(course){
                resolve(course);
            });
        });
        return promise;
    }
};


function get(cb){
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; 
    request(
    {
        method: "GET",
        headers: {Cookie: authCookies},
        jar:true,
        uri: "https://campus.austincodingacademy.com/api/courses/57a8d1e6dfcd3c11003e4e51"
        //,proxy: "http://127.0.0.1:54026" // Note the fully-qualified path to Fiddler proxy. No "https" is required, even for https connections to outside.
    },
    function(err, response, body) {
        var course = JSON.parse(body);
        cb(course);
    });
}




