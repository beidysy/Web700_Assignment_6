const Sequelize = require('sequelize');
// postgresql://neondb_owner:PRWLBXmQ90ch@ep-twilight-salad-a56sxghu.us-east-2.aws.neon.tech/neondb?sslmode=require
var sequelize = new Sequelize('neondb', 'neondb_owner', 'Zirm4UHes3Il', {
    host: 'ep-floral-sound-a58zs1j6.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Page 3
// Define the Student model
const Student = sequelize.define('Student', {
    studentNum: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
  });
  
  // Define the Course model
  const Course = sequelize.define('Course', {
    courseId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
  });
  
  // Define the relationship
  Course.hasMany(Student, { foreignKey: 'course' });




// module.exports.initialize = function () {
//     return new Promise(function (resolve, reject) {
//         reject("not implemented");
//     });
// };

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => resolve('Database synced successfully'))
        .catch(err => {
            console.error('Error syncing the database:', err);
            reject('unable to sync the database');
        });
    });
};


// module.exports.getAllStudents = function(){
//     return new Promise(function(resolve,reject){
//         reject("not implemented");
//     });
// };

module.exports.getAllStudents = function() {
    return new Promise((resolve, reject) => {
        Student.findAll()
        .then(students => {
            if (students && students.length > 0) {
                resolve(students);
            } else {
                reject("no results returned"); // This might be adjusted based on whether you consider an empty array an error
            }
        })
        .catch(err => {
            console.error('Error retrieving all students:', err);
            reject("unable to retrieve students");
        });
    });
};


module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        reject("not implemented");
    });
};

// module.exports.getCourses = function(){
//     return new Promise(function(resolve,reject){
//         reject("not implemented");
//     });
// };

module.exports.getCourses = function() {
    return new Promise((resolve, reject) => {
        Course.findAll()
        .then(courses => {
            if (courses && courses.length > 0) {
                resolve(courses); // Successfully found and returning the courses
            } else {
                reject("no results returned"); // No courses found, rejecting the promise
            }
        })
        .catch(err => {
            console.error('Error retrieving courses:', err);
            reject("unable to retrieve courses"); // Error during the operation, rejecting the promise
        });
    });
};



// module.exports.getStudentByNum = function (num) {
//     return new Promise(function (resolve, reject) {
//         reject("not implemented");
//     });
// };
module.exports.getStudentByNum = function(num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { studentNum: num }
        })
        .then(students => {
            if (students && students.length > 0) {
                resolve(students[0]); // Since studentNum should be unique, return the first object in the array.
            } else {
                reject("no results returned"); // If no student is found with the given studentNum, reject the promise.
            }
        })
        .catch(err => {
            console.error('Error retrieving student by number:', err);
            reject("unable to retrieve student by number");
        });
    });
};


// module.exports.getStudentsByCourse = function (course) {
//     return new Promise(function (resolve, reject) {
//         reject("not implemented");
//     });
// };
module.exports.getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { course: course }
        })
        .then(students => {
            if (students && students.length > 0) {
                resolve(students);
            } else {
                reject("no results returned"); // If no students are found for the course, reject the promise.
            }
        })
        .catch(err => {
            console.error('Error retrieving students by course:', err);
            reject("unable to retrieve students for the course");
        });
    });
};


// module.exports.addStudent = function (studentData) {
//     return new Promise(function(resolve, reject) {
//         reject("not implemented");
//     });
// };

// module.exports.addStudent = function(studentData) {
//     return new Promise((resolve, reject) => {
//         // Ensure the TA property is properly set to a boolean value
//         studentData.TA = studentData.TA ? true : false;
        
//         // Iterate over every property in studentData to check for empty values and replace them with null
//         for (let key in studentData) {
//             if (studentData.hasOwnProperty(key) && studentData[key] === "") {
//                 studentData[key] = null;
//             }
//         }

//         // Attempt to create a new student record
//         Student.create(studentData)
//         .then(student => {
//             resolve(student); // Operation was successful, resolve the promise with the student data
//         })
//         .catch(err => {
//             console.error('Error creating student:', err);
//             reject("unable to create student"); // There was an error in the process, reject the promise
//         });
//     });
// };
// collegeData.js
// module.exports.addStudent = function (studentData) {
//     return new Promise((resolve, reject) => {
//         // Ensure the TA property is properly set to a boolean value
//         studentData.TA = studentData.TA ? true : false;
        
//         // Replace empty string with null for Sequelize
//         Object.keys(studentData).forEach(key => {
//             if (studentData[key] === "") {
//                 studentData[key] = null;
//             }
//         });

//         // Attempt to create a new student record
//         Student.create(studentData)
//             .then(student => resolve(student)) // If success, resolve with student
//             .catch(err => reject(err)); // If error, reject with error
//     });
// };

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        // Ensure the TA property is properly set to a boolean value
        studentData.TA = studentData.TA ? true : false;
        
        // Replace empty string with null for Sequelize
        Object.keys(studentData).forEach(key => {
            if (studentData[key] === "") {
                studentData[key] = null;
            }
        });

        // Attempt to create a new student record
        Student.create(studentData)
            .then(student => {
                resolve(student); // Resolve with the created student data
            })
            .catch(err => {
                if (err.name === 'SequelizeValidationError') {
                    // If it's a validation error, you'll get more details
                    console.error('Validation errors:', err.errors.map(e => e.message));
                    reject('Validation error: ' + err.errors.map(e => e.message).join(", "));
                } else {
                    // For other types of errors, log the error and reject the promise
                    console.error('Error creating student:', err);
                    reject("Unable to create student due to unexpected error");
                }
            });
    });
};



// module.exports.getCourseById = function(id) {
//     return new Promise(function(resolve, reject) {
//         reject("not implemented");
//     });
// };

module.exports.getCourseById = function(id) {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: { courseId: id }
        })
        .then(courses => {
            if (courses && courses.length > 0) {
                resolve(courses[0]); // Assuming courseId is unique, returning the first course in the array.
            } else {
                reject("no results returned"); // If no course is found with the given id, reject the promise.
            }
        })
        .catch(err => {
            console.error('Error retrieving course by ID:', err);
            reject("unable to retrieve course by ID"); // Error during the operation, rejecting the promise.
        });
    });
};


// module.exports.updateStudent = function(studentData) {
//     return new Promise(function(resolve, reject) {
//         reject("not implemented");
//     });
// };


module.exports.updateStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        // Ensure the TA property is properly set to a boolean value
        studentData.TA = studentData.TA ? true : false;
        
        // Iterate over every property in studentData to check for empty values and replace them with null
        for (let key in studentData) {
            if (studentData.hasOwnProperty(key) && studentData[key] === "") {
                studentData[key] = null;
            }
        }

        // Attempt to update the student record
        Student.update(studentData, {
            where: { studentNum: studentData.studentNum }
        })
        .then(([affectedRows]) => {
            if (affectedRows > 0) {
                resolve(`Student updated successfully`); // At least one row was updated, operation successful
            } else {
                reject("no student updated"); // No rows were updated, might be due to no student found with the provided studentNum
            }
        })
        .catch(err => {
            console.error('Error updating student:', err);
            reject("unable to update student"); // There was an error in the process, reject the promise
        });
    });
};


// Pagw 7
module.exports.addCourse = function(courseData) {
    return new Promise((resolve, reject) => {
        // Ensure any blank values are set to null
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }
        // Attempt to create a new course record
        Course.create(courseData)
        .then(course => resolve(course)) // Resolve with the new course data
        .catch(err => reject("unable to create course")); // Reject with an error message
    });
};

module.exports.updateCourse = function(courseData) {
    return new Promise((resolve, reject) => {
        // Ensure any blank values are set to null
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }
        // Attempt to update the course record
        Course.update(courseData, {
            where: { courseId: courseData.courseId }
        })
        .then(() => resolve("course updated successfully")) // Resolve indicating success
        .catch(err => reject("unable to update course")); // Reject with an error message
    });
};
module.exports.deleteCourseById = function(id) {
    return new Promise((resolve, reject) => {
        // Attempt to delete the course by id
        Course.destroy({
            where: { courseId: id }
        })
        .then(() => resolve("course destroyed successfully")) // Resolve indicating success
        .catch(err => reject("unable to delete course")); // Reject with an error message
    });
};


module.exports.deleteStudentByNum = function(studentNum) {
    return new Promise((resolve, reject) => {
        Student.destroy({
            where: { studentNum: studentNum }
        }).then((deleted) => {
            if (deleted) {
                resolve(`Student ${studentNum} deleted.`);
            } else {
                reject(`Student ${studentNum} not found.`);
            }
        }).catch((err) => {
            reject(`Error deleting student: ${err}`);
        });
    });
};
