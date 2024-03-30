/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ahmadou Sy Student ID: 138005236 Date: March 28 2024
*
*  Online (Cycliic) Link: https://odd-pear-chicken-wig.cyclic.app/


********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
const exphbs = require('express-handlebars');

// Set up handlebars view engine with custom helpers
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts/'),
    helpers: {
        navLink: function(url, options){
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (options.fn) {
                if (lvalue === rvalue) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
            return lvalue === rvalue;
        }
    
    }
});

//NEW
app.engine('.hbs', hbs.engine);

app.set('view engine', '.hbs');

app.use(express.static('public'));
// Add the express.urlencoded({ extended: true }) middleware (using app.use())
app.use(express.urlencoded({ extended: true }));

// Require the collegeData module from the modules folder
var collegeData = require("./modules/collegeData.js");

// Add middleware to set activeRoute in app.locals
app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = '/' + (route == '/' ? '' : route);
    next();
});
// Call the initialize function before setting up the routes
collegeData.initialize().then(() => {
    console.log("Data initialized. Setting up the routes.");

    // Serve static files from the 'views' directory
    app.use(express.static(path.join(__dirname, 'views')));

    app.get("/", (req, res) => {
        res.render("home", {
            title: "Home Page"
        });
    });

    // app.get("/students", (req, res) => {
    //     if (req.query.course) {
    //         collegeData.getStudentsByCourse(req.query.course)
    //             .then(students => {
    //                 if(students.length > 0){
    //                     res.render("students", { students: students });
    //                 } else {
    //                     res.render("students", { message: "No students found for this course." });
    //                 }
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 res.render("students", { message: "Error retrieving students." });
    //             });
    //     } else {
    //         collegeData.getAllStudents()
    //             .then(students => {
    //                 res.render("students", { students: students });
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 res.render("students", { message: "Error retrieving students." });
    //             });
    //     }
    // });
    // app.get("/students", (req, res) => {
    //     collegeData.getAllStudents()
    //         .then((data) => {
    //             if (data.length > 0) {
    //                 res.render("students", { students: data });
    //             } else {
    //                 res.render("students", { message: "no results" });
    //             }
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             res.render("students", { message: "unable to fetch students" });
    //         });
    // });
    app.get("/students", (req, res) => {
        collegeData.getAllStudents()
            .then(students => {
                if (students.length > 0) {
                    res.render("students", { students: students });
                } else {
                    res.render("students", { message: "no results" });
                }
            })
            .catch(err => {
                console.error("Error retrieving students: ", err);
                res.render("students", { message: "unable to fetch students" });
            });
    });
    
    

    // app.get("/courses", (req, res) => {
    //     collegeData.getCourses()
    //         .then(courses => {
    //             if(courses.length > 0){
    //                 res.render("courses", { courses: courses });
    //             } else {
    //                 res.render("courses", { message: "No courses available." });
    //             }
    //         })
    //         .catch(error => {
    //             res.render("courses", { message: "Unable to retrieve courses." });
    //         });
    // });
    app.get("/courses", (req, res) => {
        collegeData.getCourses()
            .then((data) => {
                if (data.length > 0) {
                    res.render("courses", { courses: data });
                } else {
                    res.render("courses", { message: "no results" });
                }
            })
            .catch(err => {
                console.error(err);
                res.render("courses", { message: "unable to fetch courses" });
            });
    });
    
    
    app.get("/about", (req, res) => {
        res.render("about")
    });

    app.get("/htmlDemo", (req, res) => {
        res.render('htmlDemo');
    });

    // app.get("/students/add", (req, res) => {
    //     res.render('addStudent');
    // });
        

    app.get("/students/add", (req, res) => {
        collegeData.getCourses()
            .then(courses => {
                res.render("addStudent", { courses: courses });
            })
            .catch(err => {
                // Log the error and render the addStudent view with an empty courses array
                console.error(err);
                res.render("addStudent", { courses: [] });
            });
    });

    
    // POST route for adding a new student
    // app.post("/students/add", (req, res) => {
    //     console.log(req.body); // Log the request body to see what data is being sent
    //     collegeData.addStudent(req.body) // Assuming addStudent accepts a student object
    //         .then(() => {
    //             res.redirect("/students"); // Redirect to the students list upon successful addition
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             res.status(500).send("Unable to add student"); // Handle errors appropriately
    //         });
    // });

    // app.post("/students/add", (req, res) => {
    //     // Handle the case where no course is selected
    //     if (req.body.course === "") {
    //         req.body.course = null;
    //     }
    
    //     collegeData.addStudent(req.body)
    //         .then(() => {
    //             res.redirect("/students");
    //         })
    //         .catch((err) => {
    //             console.error("Failed to add student:", err);
    //             // Pass the error message and the previously entered data back to the form
    //             res.render("addStudent", { error: err, studentData: req.body, courses: [] });
    //         });
    // });
    app.post("/students/add", (req, res) => {
        // Handle the case where no course is selected
        if (req.body.course === "") {
            req.body.course = null;
        }
    
        collegeData.addStudent(req.body)
            .then(() => {
                res.redirect("/students"); // Redirect to the students list upon successful addition
            })
            .catch((err) => {
                console.error(err);
                // Render the form again with an error message and previously entered data
                collegeData.getCourses()
                    .then(courses => {
                        res.render("addStudent", { 
                          error: "Unable to add student", 
                          studentData: req.body, 
                          courses: courses 
                        });
                    })
                    .catch(err => {
                        // If even getCourses fails, pass an empty array for courses
                        res.render("addStudent", { 
                          error: "Unable to add student", 
                          studentData: req.body, 
                          courses: [] 
                        });
                    });
            });
    });
    

    app.get("/course/:id", (req, res) => {
        collegeData.getCourseById(req.params.id)
            .then((course) => {
                console.log(course); // Log the course data to see its structure
                res.render("course", { course: course });
            })
            .catch((err) => {
                console.error(err); // Use console.error to log the error
                res.render("course", { message: "This course does not exist." });
            });
    });
    

// app.get('/student/:studentNum', (req, res) => {
//     Promise.all([
//         collegeData.getStudentByNum(req.params.studentNum),
//         collegeData.getCourses()
//     ])
//     .then(([studentData, coursesData]) => {
//         console.log('Courses data:', coursesData); // Check what courses data you're getting here.
//         res.render('student', {
//             student: studentData,
//             courses: coursesData // Make sure this is an array
//         });
//     })
//     .catch(err => {
//         console.error(err);
//         res.status(500).send('Error loading student edit form');
//     });
// });

// app.get("/student/:studentNum", (req, res) => {
//     let viewData = {};

//     collegeData.getStudentByNum(req.params.studentNum).then((data) => {
//         if (data) {
//             viewData.student = data; // store student data in the "viewData" object as "student"
//         } else {
//             viewData.student = null; // set student to null if none were returned
//         }
//     }).catch((err) => {
//         viewData.student = null; // set student to null if there was an error
//     }).then(collegeData.getCourses)
//     .then((data) => {
//         viewData.courses = data; // store course data in the "viewData" object as "courses"
//         // loop through viewData.courses and once we have found the courseid that matches
//         // the student's "course" value, add a "selected" property to the matching // viewData.courses object
//         if (viewData.student) {
//             viewData.courses.forEach(course => {
//                 if (course.courseId === viewData.student.course) {
//                     course.selected = true;
//                 }
//             });
//         }
//     }).catch(() => {
//         viewData.courses = []; // set courses to empty if there was an error
//     }).then(() => {
//         if (!viewData.student) { // if no student - return an error
//             res.status(404).send("Student Not Found");
//         } else {
//             res.render("student", { viewData: viewData }); // render the "student" view
//         }
//     });
// });

app.get('/student/:studentNum', (req, res) => {
    let viewData = {};

    // Fetch the student by student number
    collegeData.getStudentByNum(req.params.studentNum).then((student) => {
        if (student) {
            viewData.student = student; //store student data in the "viewData" object as "student"
        } else {
            viewData.student = null; // set student to null if no student was returned
        }
    }).catch((err) => {
        viewData.student = null; // set student to null if there was an error
    }).then(collegeData.getCourses)
    .then((courses) => {
        viewData.courses = courses; // store courses data in the "viewData" object as "courses"
        res.render("student", { viewData: viewData }); // render the "student" view with the viewData object
    }).catch((err) => {
        viewData.courses = []; // set courses to empty if there was an error
        res.render("student", { viewData: viewData });
    });
});

        
    app.post('/student/update', (req, res) => {
        // The form should include a hidden input that contains the studentNum
        collegeData.updateStudent(req.body)
            .then(() => {
                res.redirect('/students'); // Redirect to the list of students after a successful update
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Unable to update student."); // Display error message on failure
            });
    });
    // Pagwe 7-8
    app.get("/courses/add", (req, res) => {
        res.render("addCourse"); // This should render a view with a form for adding a new course
    });

    app.post("/courses/add", (req, res) => {
        collegeData.addCourse(req.body) // Assuming addCourse accepts a course object
            .then(() => {
                res.redirect("/courses"); // Redirect to the courses list upon successful addition
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to add course"); // Handle errors appropriately
            });
    });

    app.get("/courses/update/:id", (req, res) => {
        collegeData.getCourseById(req.params.id)
            .then((course) => {
                if (course) {
                    res.render("updateCourse", { course: course }); // Render the update form with course data
                } else {
                    res.status(404).send("Course Not Found");
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to retrieve course for update");
            });
    });

    app.post("/courses/update", (req, res) => {
        collegeData.updateCourse(req.body) // Assuming updateCourse accepts a course object
            .then(() => {
                res.redirect("/courses"); // Redirect to the courses list upon successful update
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to update course"); // Handle errors appropriately
            });
    });

    app.get("/courses/delete/:id", (req, res) => {
        collegeData.deleteCourseById(req.params.id)
            .then(() => {
                res.redirect("/courses"); // Redirect to the courses list upon successful deletion
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to remove course"); // Handle errors appropriately
            });
    });

    app.get('/student/delete/:studentNum', (req, res) => {
        collegeData.deleteStudentByNum(req.params.studentNum)
        .then((msg) => {
            res.redirect('/students');
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });
    
    
    

    // Catch-all route for handling unmatched routes
    app.use((req, res) => {
        res.status(404).send("Page Not Found");
    });

    // Start the server after the data has been initialized
    app.listen(HTTP_PORT, () => {
        console.log("Server listening on port: " + HTTP_PORT);
    });

}).catch(err => {
    console.error("Failed to initialize data:", err);
});



