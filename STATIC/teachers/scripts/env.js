const env = {
    "active_page": null,
    "app": document.getElementById("app"),
    "scripts": {
        "paths": {
            "dash": "./components/dash.js",
            "create": "./components/create.js",
            "choose": "./components/choose.js",
            "publish": "./components/share.js",
            "submissions": "./components/submissions.js",
            "studentwise": "./components/studentwise.js",
            "reports": "./components/reports.js",
            "assignments": "./components/assignments.js",
            "view": "./components/share.js"
        },
        "elements": {
            "dash": null,
            "create": null,
            "choose": null,
            "publish": null,
            "submissions": null,
            "studentwise": null,
            "reports": null,
            "assignments": null,
            "view": null
        },
        "data": {
            "dash": null,
            "create": null,
            "choose": null,
            "publish": null,
            "submissions" : null,
            "studentwise": null,
            "reports": null,
            "assignments": null,
            "view": null
        }
    },
    "messages": [],
    "init": () => {
        let url = new URL(window.location.href);
        env.active_page = url.searchParams.get('app');
        if (env.active_page === null || env.active_page === undefined ) {
            env.active_page = "dash";
        }
        if (document.querySelector(".nav_elm_active")) {
            document.querySelector(".nav_elm_active").classList.remove("nav_elm_active");
        }
        // document.querySelector(`[nav="${env.active_page}"]`).classList.add("nav_elm_active");
        eval(`env.load.components.${env.active_page}()`);


        document.querySelectorAll(".nav_elm").forEach((e) => {
            e.onclick = () => {
                if (document.querySelector(".nav_elm_active")) {
                    document.querySelector(".nav_elm_active").classList.remove("nav_elm_active");
                }
                e.classList.add("nav_elm_active");
                env.active_page = e.getAttribute("nav");
                eval(`env.load.components.${env.active_page}()`);

                // Update URL

                let newUrl = new URL(window.location.href);
                newUrl.searchParams.set('app', env.active_page);
                if (newUrl.searchParams.get('app') === "playground" && newUrl.searchParams.get('id') === null && newUrl.searchParams.get('language') === null) {
                    newUrl.searchParams.set('id', "123456")
                    newUrl.searchParams.set('language', "text")
                } else if (newUrl.searchParams.get('app') !== "playground" && newUrl.searchParams.get('id') !== null && newUrl.searchParams.get('language') !== null) {
                    // newUrl.searchParams.set('id',"")
                    // newUrl.searchParams.set('language',"")
                    newUrl.searchParams.delete('id')
                    newUrl.searchParams.delete('language')
                } else if (newUrl.searchParams.get("app") !== "create" || newUrl.searchParams.get("app") === null) {
                    if(newUrl.searchParams.get("mode") !== null) {
                        newUrl.searchParams.delete("mode")
                    }
                }
                history.pushState({}, '', newUrl);
            }
        })
    },
    "load": {
        "components": {
            "dash": () => {
                fetch("./components/dash.cmfe")
                    .then((dash) => dash.text())
                    .then((dash) => {
                        fetch("../database.json")
                            .then((resp) => resp.json())
                            .then((resp) => {
                
                                let newUrl = new URL(window.location.href);
                                let institute_id = newUrl.searchParams.get("institute_id")
                                let teacher_id = newUrl.searchParams.get('teacher_id');
                               
                                env.scripts.data.dash = resp.filter(institute => institute.id === institute_id)
                                // console.log(institute_response[0].teachers);
                                // console.log(institute_response[0].teachers.filter(teacher => teacher.id === teacher_id))
                                console.log(resp);
                                console.log(env.scripts.data.dash);
                                let assignments_of_teachers
                                if (env.scripts.data.dash !== null) {
                                     assignments_of_teachers = env.scripts.data.dash[0].assignments.filter(assignment => assignment.teacherId === teacher_id)
                                }
                               
                               
                            //   let filteredAssignments = env.scripts.data.submissions.assignments.filter(assignment => assignment.aid === newUrl.searchParams.get('aid'));
                                ;
                                // console.log(env.scripts.data.dash.assignments.unchecked[0].submissions)
                                dash = dash.replace("{{teacher.students.count}}", "2");
                                dash = dash.replace("{{teacher.assignments}}", assignments_of_teachers.length);
                                dash = dash.replace("{{teacher.unchecked}}", "03");
                                return dash;
                            }).then((dash) => {
                                env.scripts.elements.dash = document.createElement("script");
                                env.scripts.elements.dash.src = env.scripts.paths.dash;
                            }).then(() => {
                                var elm = document.createElement("script");
                                elm.src = env.scripts.paths.dash;
                                document.body.appendChild(elm);
                            }).then(() => {
                                setTimeout(() => {

                                    let newUrl = new URL(window.location.href);
                                
                                    let teacher_id = newUrl.searchParams.get('teacher_id');
                                    let assignments_of_teachers = env.scripts.data.dash[0].assignments.filter(assignment => assignment.teacherId === teacher_id)
                                    console.log(assignments_of_teachers);
                                    let teacherData = env.scripts.data.dash[0].teachers.filter(teacher => teacher.id === teacher_id)
                                    var uncheckedLength = assignments_of_teachers.length
                                    let submissions = env.scripts.data.dash[0].submissions.filter(submission =>  submission.id === assignments_of_teachers[uncheckedLength -1].submisssions_id)
                                 
                                    var assignments__sa = "";
                                 
                                    console.log(env.scripts.data.dash[0].students.forEach((e) => {
                                        console.log(e.submissions.filter(submission => submission.aid === assignments_of_teachers[uncheckedLength -1].id ))
                                    }))

                                    assignments_of_teachers.forEach((e,index) => {
                                        var temp = dash_elm_teachers.pending;
                                        temp = temp.replace("{{assignments.pending.title}}",e.title)
                                        temp = temp.replace("{{assignments.pending.description}}",e.description)
                                        temp = temp.replace("{{assignments.pending.submissions}}",submissions.length)
                                        temp = temp.replace("{{assignments.pending.yet}}",teacherData[0].students - submissions.length)
                                        temp = temp.replace("{{assignment_id}}",e.id)
                                        if(index === uncheckedLength - 1) {
                                            assignments__sa += temp;
                                        }
                                    });

                                    dash = dash.replace("{{data}}", assignments__sa);
                                    // console.log(dash);
                                    env.app.innerHTML = dash;
                                    env.app.appendChild(env.scripts.elements.dash);
                                }, 100);
                            })
                    })
            },
           
            "create": () => {
                const queryParams = new URL(window.location.href);
                const mode = queryParams.searchParams.get('mode'); 
            
                let createFile;
                if (mode === 'manual') {
                    createFile = "./components/create.cmfe";
                } else if (mode === 'ai') {
                    createFile = "./components/create-2.cmfe";
                } else {
                    // Default to a certain file if no mode is specified
                    createFile = "./components/create.cmfe";
                }
                fetch(createFile)
                    .then((create) => create.text())
                    .then((create) => {
                        env.scripts.elements.create = document.createElement("script");
                        env.scripts.elements.create.src = env.scripts.paths.create;
                        return create;
                    })
                    .then((create) => {
                        var elm = document.createElement("script");
                        elm.src = env.scripts.paths.create
                        document.body.appendChild(elm);
                        return create
                    })
                    .then((create) => {
                     
                            env.app.innerHTML = create;
                            env.app.appendChild(env.scripts.elements.create);
                   
                    })
            },
            "choose": () => {
                fetch("./components/choose.cmfe")
                    .then((choose) => choose.text())
                    .then((choose) => {
                        env.scripts.elements.choose = document.createElement("script");
                        env.scripts.elements.choose.src = env.scripts.paths.choose;
                        return choose;
                    })
                    .then((choose) => {
                        var elm = document.createElement("script");
                        elm.src = env.scripts.paths.choose
                        document.body.appendChild(elm);
                        return choose
                    })
                    .then((choose) => {
                     
                            env.app.innerHTML = choose;
                            env.app.appendChild(env.scripts.elements.choose);
                   
                    })
            },
            "publish": () => {
                fetch("./components/publish-share.cmfe")
                    .then((publish) => publish.text())
                    .then((publish) => {
                            const queryParams = new URL(window.location.href);
                            const institute_id = queryParams.searchParams.get('institute_id');
                            const assignment_id = queryParams.searchParams.get('assignment_id') 
                            fetch(`http://localhost:8002/share/?institute_id=${institute_id}&assignment_id=${assignment_id}`)
                            .then((res) => res.json())
                            .then ((res) => {
                                console.log(res.assignment.problem_statement);
                                publish = publish.replace("{{problem.description}}", res.assignment.problem_statement);
                                publish = publish.replace("{{problem.difficulty}}", res.assignment.difficulty);
                                publish = publish.replace("{{assignment_id}}", assignment_id);
                                return publish
                            }).then((dash) => {
                                env.scripts.elements.publish = document.createElement("script");
                                env.scripts.elements.publish.src = env.scripts.paths.publish;
                            }).then(() => {
                                var elm = document.createElement("script");
                                elm.src = env.scripts.paths.publish;
                                document.body.appendChild(elm);
                            })
                             .then(() => {
                                setTimeout(() => {
                                    env.app.innerHTML = publish;
                                    env.app.appendChild(env.scripts.elements.publish);
                                },100)
                             })
                    })
            },
            "submissions" : () => {
                fetch("./components/submissions.cmfe")
                .then((submissions) => submissions.text())
                .then((submissions) => {
                    let newUrl = new URL(window.location.href);
                    let institute_id = newUrl.searchParams.get("institute_id")
                    let teacher_id = newUrl.searchParams.get('teacher_id');
                    let aid = newUrl.searchParams.get('aid');
                    fetch(`http://localhost:8002/teacher/get_submissions/?institute_id=${institute_id}&teacher_id=${teacher_id}&assignment_id=${aid}`)
                    .then((res) => res.json())
                    .then((res) => {
                             
                               env.scripts.data.submissions = res
                               console.log(env.scripts.data.submissions);
                                // console.log(env.scripts.data.submissions[0].students.forEach((e) => {
                                //     console.log(e.submissions.filter(submission => submission.aid === aid))
                                // }))
                        // let newUrl = new URL(window.location.href);
                        //     newUrl.searchParams.get('aid');
                        //   let filteredAssignments = env.scripts.data.submissions.assignments.filter(assignment => assignment.aid === newUrl.searchParams.get('aid'));
                        submissions = submissions.replace("{{assignment_title}}",env.scripts.data.submissions.assignment_data[0].title)
                    }).then(() => {
                        env.scripts.elements.submissions = document.createElement("script")
                        env.scripts.elements.submissions.src = env.scripts.paths.submissions
                    })
                    .then(() => {
                        var elm = document.createElement("script");
                        elm.src = env.scripts.paths.submissions
                        document.body.appendChild(elm);
                    }).then(() => {
                        setTimeout(() => {
                             let unchecked__ = "";

                         
                        if(env.scripts.data.submissions !== null) {
                          if(env.scripts.data.submissions.submissions === null) {
                            env.app.appendChild(env.scripts.elements.submissions);
                       
                            submissions = submissions.replace("{{data}}", "No Submissions yet :)");
                            env.app.innerHTML = submissions
                          } else {
                            
                            env.scripts.data.submissions.submissions.forEach((e) => {
                                var temp2 = uncheck_assign.unchecked;
                             
                                temp2 = temp2.replace("{{students.name}}", e.name);
                                temp2 = temp2.replace("{{students.submitted_on}}", e.submitted_on);
                                if(e.submitted_on <= filteredAssignments[0].due_date) {
                                    temp2 = temp2.replace("{{students.ontime}}", "Ontime");
                                    temp2 = temp2.replace("{{bg_color}}", "#2A9D8F");
                                } else {
                                    temp2 = temp2.replace("{{students.ontime}}", "Delayed");
                                    temp2 = temp2.replace("{{bg_color}}", "#EF476F");
                                    // studentEntries.classList.add('late');
                                }
                                temp2 = temp2.replace("{{assignments.pending.difficulty}}", e.difficulty);
                                temp2 = temp2.replace("{{assignments.pending.aid}}", e.aid);
                                unchecked__ += temp2;
                            });
                          }
        
                            // env.app.innerHTML = assign+assignments_pending;
                            env.app.appendChild(env.scripts.elements.submissions);
                       
                            submissions = submissions.replace("{{data}}", unchecked__);
                            env.app.innerHTML = submissions
                            // activate_task_elms();
                          }
                        }, 100);
                    })
                })
            },
            "studentwise" : () => {
                fetch("./components/student-wise.cmfe")
                .then((student) => student.text())
                .then((student) => {
                    fetch("../db.json")
                    .then((res) => res.json())
                    .then((res) => {
                        env.scripts.data.studentwise = res.teachers
                        console.log(res.teachers)
                    }).then(() => {
                        env.scripts.elements.studentwise = document.createElement("script")
                        env.scripts.elements.studentwise.src = env.scripts.paths.studentwise
                    })
                    .then(() => {
                        var elm = document.createElement("script");
                        elm.src = env.scripts.paths.studentwise
                        document.body.appendChild(elm);
                    }).then(() => {
                        setTimeout(() => {
                             let checked__ = "";
                            //  let assignment__ = ""
                            console.log(env.scripts.data.studentwise.assignments.checked[0]);
                            if(env.scripts.data.studentwise !== null) {
                                env.scripts.data.studentwise.assignments.checked[0].submissions.forEach((e) => {
                                    var temp2 = check_assign.checked_status;
                                    temp2 = temp2.replace("{{students.name}}", e.name);
                                    temp2 = temp2.replace("{{student.accuracy}}", `  <div class="pie-wrapper">
                                    <span class="label">
                                        <span class="num">${e.accuracy}</span>
                                    </span>
                                    <div class="pie">
                                      <div class="left-side half-circle"></div>
                                      <div class="right-side half-circle"></div>
                                    </div>
                                    <div class="shadow"></div>
                                  </div>`);
                                    temp2 = temp2.replace("{{student.efficiency}}",`  <div class="pie-wrapper">
                                    <span class="label">
                                        <span class="num">${e.efficiency}</span>
                                    </span>
                                    <div class="pie">
                                      <div class="left-side half-circle"></div>
                                      <div class="right-side half-circle"></div>
                                    </div>
                                    <div class="shadow"></div>
                                  </div>`);
                                    temp2 = temp2.replace("{{student.score}}", `  <div class="pie-wrapper">
                                    <span class="label">
                                        <span class="num">${e.score}</span>
                                    </span>
                                    <div class="pie">
                                      <div class="left-side half-circle"></div>
                                      <div class="right-side half-circle"></div>
                                    </div>
                                    <div class="shadow"></div>
                                  </div>`);
                                    checked__ += temp2;
                                });
                              }
        
                            // env.app.innerHTML = assign+assignments_pending;
                            env.app.appendChild(env.scripts.elements.studentwise);
                       
                            student = student.replace("{{data}}", checked__);
                            env.app.innerHTML = student
                        }, 100);
                    })
                })
            },
            "assignments": () => {
                fetch("./components/assignments.cmfe")
                .then((assign) => assign.text())
                .then((assign) => {
                    let newUrl = new URL(window.location.href);
                    let institute_id = newUrl.searchParams.get("institute_id")
                    let teacher_id = newUrl.searchParams.get('teacher_id');
                    // let aid = newUrl.searchParams.get('aid');
                    fetch(`http://localhost:8002/teacher/get_assignments/?institute_id=${institute_id}&teacher_id=${teacher_id}`)
                        .then((resp) => resp.json())
                        .then((resp) => {
                            env.scripts.data.assignments = resp;
                            console.log(resp);
                            return assign;
                        }).then((assign) => {
                            env.scripts.elements.assignments = document.createElement("script");
                            env.scripts.elements.assignments.src = env.scripts.paths.assignments;
                        }).then(() => {
                            var elm = document.createElement("script");
                            elm.src = env.scripts.paths.assignments;
                            document.body.appendChild(elm);
                        }).then(() => {
                            setTimeout(() => {
                                var assignments__sa = "";
                              
                                env.scripts.data.assignments.assignments.forEach((e) => {
                                    var temp = assign_teachers.pending;
                                    temp = temp.replace("{{assignments.pending.title}}",e.title)
                                    temp = temp.replace("{{assignments.pending.description}}",e.description)
                                    temp = temp.replace("{{assignments.pending.due_date}}",e.due_date)
                                    temp = temp.replace("{{assignments.pending.difficulty}}",e.difficulty)
                                    temp = temp.replace("{{assignments.pending.submissions}}",e.submissions.length)
                                    temp = temp.replace("{{assignments.pending.yet}}",env.scripts.data.assignments.students - e.submissions.length)
                                    temp = temp.replace("{{assignment_id}}",e.aid)
                                    assignments__sa += temp;
                                });

                                assign = assign.replace("{{data}}", assignments__sa);
                                
                                env.app.innerHTML = assign;
                                env.app.appendChild(env.scripts.elements.assignments);
                            }, 100);
                        })
                })
            },
            "view" : () => {
                fetch("./components/view.cmfe")
                .then((view) => view.text())
                .then((view) => {
                        const queryParams = new URL(window.location.href);
                        const institute_id = queryParams.searchParams.get('institute_id');
                        const assignment_id = queryParams.searchParams.get('assignment_id') 
                        fetch(`http://localhost:8002/share/?institute_id=${institute_id}&assignment_id=${assignment_id}`)
                        .then((res) => res.json())
                        .then ((res) => {
                            console.log(res.assignment.problem_statement);
                            view = view.replace("{{problem.description}}", res.assignment.problem_statement);
                            view = view.replace("{{problem.sample_output}}", res.assignment.sample_output);
                            view = view.replace("{{problem.sample_input}}", res.assignment.sample_input);
                            return view
                        }).then((view) => {
                            env.scripts.elements.view = document.createElement("script");
                            env.scripts.elements.view.src = env.scripts.paths.view;
                        }).then(() => {
                            var elm = document.createElement("script");
                            elm.src = env.scripts.paths.view;
                            document.body.appendChild(elm);
                        })
                         .then(() => {
                            setTimeout(() => {
                                env.app.innerHTML = view;
                                env.app.appendChild(env.scripts.elements.view);
                            },100)
                         })
                })
            }
        }
    }
}












env.init();