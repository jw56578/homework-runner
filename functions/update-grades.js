module.exports = updateStudentGrades;
var userapi = require('../api/user');

var data = {
    user:null,
    studentInfo:null,
};
function updateStudentGrades(students){
    for(var s in students){
        var student = students[s];
        getStudent(student);
    }

}
function getStudent(s,cb){
    userapi.get(s.id).then(function(user){
        updateGrade(s,user)
    });
}
function updateGrade(student,user){
    //{courseId: "57a8d1e6dfcd3c11003e4e51", name: "Homework 1", score: 100}
    var grades = user.grades;
    var grade = grades.filter((g)=> g.courseId === '' && g.name === '')[0];
    if(grade){
        grade.score = ((student.numberOfTests - student.failuers) / student.numberOfTests) * 100;
    }
    userapi.update(user);


}