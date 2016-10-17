'use strict'
const authCookies = require('./auth-cookies');
const request = require('request');
const Promise = require('Promise');
const cheerio = require('cheerio')

module.exports = {
    get:function(id){
        var promise = new Promise(function (resolve, reject) {
            get(id,function(user){
                resolve(user);
            });
        });
        return promise;
    },
    update:update,
    getCsrfToken:getCsrfToken
};


function get(id, cb){
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; 
    request(
    {
        method: "GET",
        headers: {Cookie: authCookies},
        jar:true,
        uri: "https://campus.austincodingacademy.com/api/users/" + id
        //,proxy: "http://127.0.0.1:32566" // Note the fully-qualified path to Fiddler proxy. No "https" is required, even for https connections to outside.
    },
    function(err, response, body) {
        var user = JSON.parse(body);
        cb(user);
    });
}
function update(user,token)
{
    request(
        { 
            method: 'PUT',
            headers: {
                Cookie: authCookies,
                "X-CSRF-TOKEN":token
            },
            uri: 'https://campus.austincodingacademy.com/api/users/' + user.id,
            json: (user)
            //,proxy: "http://127.0.0.1:32566" // Note the fully-qualified path to Fiddler proxy. No "https" is required, even for https connections to outside.
        }
        , function (error, response, body) {
            var whathappened = body;
        }   
    )
}
function getCsrfToken(userId,cb){
    //have to make request to actual page and parse out
    //<meta name="csrf-token" content="trxMYIFz-e6GLianmksmxVzfehNeqwr2amUU">
    //https://campus.austincodingacademy.com/#users/57e2fdd833f52211001aa539

    request(
    {
        method: "GET",
        headers: {Cookie: authCookies},
        jar:true,
        uri: "https://campus.austincodingacademy.com/#users/" + userId
        //,proxy: "http://127.0.0.1:32566" // Note the fully-qualified path to Fiddler proxy. No "https" is required, even for https connections to outside.
    },
    function(err, response, body) {
        let $ = cheerio.load(body);
        let token = $("meta[name='csrf-token']" );
        token = token.attr('content');
        cb(token);
       
    });


}


