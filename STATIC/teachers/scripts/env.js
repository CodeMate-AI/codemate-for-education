const env = {
    "active_page": null,
    "app": document.getElementById("app"),
    "scripts": {
        "paths": {
            "dash": "./components/dash.js",
            "create": "./components/create.js",
            "create2": "./components/create2.js",
            "choose": "./components/choose.js",
            "publish": "./components/share.js",
            "submissions": "./components/submissions.js",
            "studentwise": "./components/studentwise.js",
            "reports": "./components/reports.js",
            "playground": "./components/playground.js",
            "assignments": "./components/assignments.js",
            "view": "./components/share.js",
            "profile": "./components/profile.js"
        },
        "elements": {
            "dash": null,
            "create": null,
            "create2":null,
            "choose": null,
            "publish": null,
            "submissions": null,
            "studentwise": null,
            "reports": null,
            "assignments": null,
            "view": null,
            "profile": null
        },
        "data": {
            "dash": null,
            "create": null,
            "create2": null,
            "choose": null,
            "publish": null,
            "submissions" : null,
            "studentwise": null,
            "reports": null,
            "assignments": null,
            "view": null,
            "profile": null
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

        if (env.active_page === "dash") {
            const dashboardElement = document.getElementById('dashboard');
            dashboardElement.classList.add("nav_elm_active");
        }
        // document.querySelector(`[nav="${env.active_page}"]`).classList.add("nav_elm_active");
        eval(`env.load.components.${env.active_page}()`);


        document.querySelectorAll(".nav_elm").forEach((e) => {
            e.onclick = () => {
                //close the sidebar
                const sidebar = document.getElementById('sidebar');
            if (!sidebar.classList.contains('hidden')) {
                sidebar.classList.remove('show');
                setTimeout(() => {
                    sidebar.classList.add('hidden');
                }, 300); // Delay to match the CSS transition duration
                }

                
                if (document.querySelector(".nav_elm_active")) {
                    document.querySelector(".nav_elm_active").classList.remove("nav_elm_active");
                }
                e.classList.add("nav_elm_active");
                env.active_page = e.getAttribute("nav");
                eval(`env.load.components.${env.active_page}()`);

                // Update URL

                let newUrl = new URL(window.location.href);
                newUrl.searchParams.set('app', env.active_page);
                if (newUrl.searchParams.get('app') === "playground")//clicking on playground button in sidebar means you just want the code editor to run your own code
                {
                    newUrl.searchParams.forEach((value, key) => {
                        if (!['institute_id', 'student_id', 'app', 'language','teacher_id'].includes(key)) {
                            newUrl.searchParams.delete(key);
                        }
                    });
                }
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
                window.location.reload()
            }
        })
    },
    "load": {
        "components": {
            "dash": () => {
                fetch("./components/dash.cmfe")
                    .then((dash) => dash.text())
                    .then((dash) => {
                        let newUrl = new URL(window.location.href);
                        let institute_id = newUrl.searchParams.get("institute_id")
                        let teacher_id = newUrl.searchParams.get('teacher_id');
                        // let aid = newUrl.searchParams.get('aid');
                        fetch(`https://backend.edu.codemate.ai/teacher/get_assignments?institute_id=${institute_id}&teacher_id=${teacher_id}`)
                            .then((resp) => resp.json())
                            .then((resp) => {
                                console.log(resp);
                                let newUrl = new URL(window.location.href);
                                let institute_id = newUrl.searchParams.get("institute_id")
                                let teacher_id = newUrl.searchParams.get('teacher_id');
                               
                                env.scripts.data.dash = resp
                                // console.log(institute_response[0].teachers);
                                // console.log(institute_response[0].teachers.filter(teacher => teacher.id === teacher_id))
                                console.log(resp);
                                // let tempx = env.scripts.data.dash;
                                // let assignments_of_teachers
                                // if (tempx.length !== 0) {
                                //     console.log(tempx);
                                //      assignments_of_teachers = env.scripts.data.dash[0].assignments.filter(assignment => assignment.teacherId === teacher_id)
                                // }
                               
                               
                            //   let filteredAssignments = env.scripts.data.submissions.assignments.filter(assignment => assignment.aid === newUrl.searchParams.get('aid'));
                                ;
                                // console.log(env.scripts.data.dash.assignments.unchecked[0].submissions)
                                dash = dash.replace("{{teacher.students.count}}", env.scripts.data.dash.students.length);
                                dash = dash.replace("{{teacher.assignments}}", env.scripts.data.dash.assignments.length);
                               if(env.scripts.data.dash.assignments.length === 0) {
                                dash = dash.replace("{{teacher.unchecked}}", "0");
                               } else {
                                dash = dash.replace("{{teacher.unchecked}}", env.scripts.data.dash.assignments.length);
                               }
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

                                    if(env.scripts.data.dash.assignments.length !== 0) {
                                        var uncheckedLength = env.scripts.data.dash.assignments.length
                                        console.log(uncheckedLength);
                                      
                                        var assignments__sa = "";
                                        
                                        // env.scripts.data.dash.assignments.forEach((e,index) => {
                                        //     var temp = dash_elm_teachers.pending;
                                            
                                        //     if(dash_elm_teachers !== undefined) {
                                              
                                        //             temp = temp.replace("{{assignments.pending.title}}",e.title)
                                        //             temp = temp.replace("{{assignments.pending.description}}",e.description)
                                        //             temp = temp.replace("{{assignments.pending.submissions}}",env.scripts.data.dash.submissions.length)
                                        //             temp = temp.replace("{{assignments.pending.yet}}",env.scripts.data.dash.students.length - env.scripts.data.dash.submissions.length)
                                        //             temp = temp.replace("{{assignment_id}}",e.id)
            
                                        //             if(index === uncheckedLength-1) {
                                        //                 assignments__sa += temp;
                                        //             }
                                        //         }
                                        //     })
                                      
                                         env.scripts.data.dash.assignments.forEach((e, index) => {
                                            // Make a request to the backend to get submissions for each assignment
                                            fetch(`https://backend.edu.codemate.ai/teacher/get_submissions?institute_id=${institute_id}&teacher_id=${teacher_id}&assignment_id=${e.id}`)
                                                .then(response => response.json())
                                                .then(data => {
                                                    const submissions = data.submissions;
                                        
                                                    const submissionsCount = submissions.length;
                                        
                                                    // finding number of unique student IDs in the submissions
                                                    const uniqueStudentIds = new Set(submissions.map(submission => submission.student_id)).size;
                                        
                                                    // calculate the number of students who haven't submitted yet
                                                    const pendingSubmissions = env.scripts.data.dash.students.length - uniqueStudentIds;
                                        
                                                    var temp = dash_elm_teachers.pending;
                                                    temp = temp.replace("{{assignments.pending.title}}", e.title);
                                                    temp = temp.replace("{{assignments.pending.description}}", e.description);
                                                     //we need to convert unix timestamp to date string
                                                    let unixTimestamp = e.due_date;
                                                    let dateObj = new Date(unixTimestamp * 1000);
                                                    let utcString = dateObj.toUTCString();
                                                    temp = temp.replace("{{assignments.pending.due_date}}", utcString);
                                                    temp = temp.replace("{{assignments.pending.submissions}}", submissionsCount);
                                                    temp = temp.replace("{{assignments.pending.yet}}", pendingSubmissions);
                                                    temp = temp.replace("{{assignment_id}}", e.id);
                                        
                                                    
                                                    if (index === env.scripts.data.dash.assignments.length - 1) {
                                                        assignments__sa += temp;
                                                        dash = dash.replace("{{data}}", assignments__sa);
                                                        env.app.innerHTML = dash;
                                                        env.app.appendChild(env.scripts.elements.dash);
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error('Error fetching submissions:', error);
                                                });
                                        });
                                            //  dash = dash.replace("{{data}}", assignments__sa);
                                            //  // console.log(dash);
                                            //  env.app.innerHTML = dash;
                                            //  env.app.appendChild(env.scripts.elements.dash);
                                    } else {
                                        dash = dash.replace("{{data}}", `<p>Nothing to show here :)</p>`);
                                             // console.log(dash);
                                             env.app.innerHTML = dash;
                                             env.app.appendChild(env.scripts.elements.dash);
                                    }
                                }, 100);
                            })
                    })
            },
            "playground": () => {
                fetch("./components/playground.cmfe")
                    .then((play) => play.text())
                    // .then((playground) => {
                    //     env.app.innerHTML = playground;
                    //     var script = document.createElement("script");
                    //     script.src = env.scripts.paths.playground;
                    //     document.body.appendChild(script);
                    // })
                    .then((playground) => {
                        let newUrl = new URL(window.location.href);
                        let assignment_id = newUrl.searchParams.get('assignment_id');
                        let student_id= newUrl.searchParams.get('student_id')
                        fetch(`https://backend.edu.codemate.ai/student/get_assignment?institute_id=123456&assignment_id=${assignment_id}&student_id=${student_id}`)
                        .then((res) => res.json())
                        .then((res) => {
                                env.scripts.data.playground = res;
                                console.log("res=",res);
                                // playground = playground.replace("{{title}}", res.assignment.title);
                                // playground = playground.replace("{{description}}", res.assignment.description);
                                // return assign
                            }).then((solve) => {
                                env.scripts.elements.playground = document.createElement("script");
                                env.scripts.elements.playground.src = env.scripts.paths.playground;
                            }).then(() => {
                                var elm = document.createElement("script");
                                elm.src = env.scripts.paths.playground;
                                document.body.appendChild(elm);
                            }).then(() => {
                                // setTimeout(() => {
                                    //  let assignments_pending = "";
                    
                                    // env.scripts.data.playground.assignments.forEach((e) => {
                                    //     var temp2 = pa_elm.pending;
                                
                                    //     temp2 = temp2.replace("{{assignments.pending.title}}", e.title);
                                    //     temp2 = temp2.replace("{{assignments.pending.description}}", e.description);
                                    //     temp2 = temp2.replace("{{assignments.pending.due_date}}", e.due_date);
                                    //     temp2 = temp2.replace("{{assignments.pending.difficulty}}", e.difficulty);
                                    //     temp2 = temp2.replace("{{assignments.pending.aid}}", e.id);
                                    
                                    //     assignments_pending += temp2;
                                    // });
                
                                    // env.app.innerHTML = assign+assignments_pending;
                                    env.app.innerHTML = playground;
                                    // setTimeout(()=>{
                                        env.app.appendChild(env.scripts.elements.playground);
                                    // }, 100);
                                    // playground = playground.replace("{{assignments.pending}}", assignments_pending);
                                // }, 100);
                            })
                    })
            },
            "create": () => {
                const queryParams = new URL(window.location.href);
                const mode = queryParams.searchParams.get('mode'); 
            
                let createFile= "./components/create.cmfe";

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
            "create2": () => {
                const queryParams = new URL(window.location.href);
                const mode = queryParams.searchParams.get('mode'); 
            
                let createFile2
                    createFile2 = "./components/create2.cmfe";
                
                fetch(createFile2)
                    .then((create2) => create2.text())
                    .then((create2) => {
                        env.scripts.elements.create2 = document.createElement("script");
                        env.scripts.elements.create2.src = env.scripts.paths.create2;
                        return create2;
                    })
                    .then((create2) => {
                        var elm = document.createElement("script");
                        elm.src = env.scripts.paths.create2
                        document.body.appendChild(elm);
                        return create2
                    })
                    .then((create2) => {
                     
                            env.app.innerHTML = create2;
                            env.app.appendChild(env.scripts.elements.create2);
                   
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
                            fetch(`https://backend.edu.codemate.ai/share/?institute_id=${institute_id}&assignment_id=${assignment_id}`)
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
                    fetch(`https://backend.edu.codemate.ai/teacher/get_submissions?institute_id=${institute_id}&teacher_id=${teacher_id}&assignment_id=${aid}`)
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
                          if(env.scripts.data.submissions.submissions.length === 0) {
                            env.app.appendChild(env.scripts.elements.submissions);
                       
                            submissions = submissions.replace("{{data}}", "No Submissions yet :)");
                            env.app.innerHTML = submissions
                          } else {
                            
                              env.scripts.data.submissions.submissions.forEach((e) => {
                                console.log("e=",e)
                                var temp2 = uncheck_assign.unchecked;
                             
                                temp2 = temp2.replace("{{students.name}}", "Srishti");
                                  temp2 = temp2.replace("{{students.submitted_on}}", e.date_time);
                                  console.log("env.scripts.data.submissions.assignment_data=", env.scripts.data.submissions.assignment_data)
                                  const date = new Date(e.date_time);
                                 // Convert the Date object to a Unix timestamp (in seconds)
                                  const submissionDateUnix = Math.floor(date.getTime() / 1000);
                                  console.log("submissionDateUnix=",submissionDateUnix)
                                if(submissionDateUnix <= env.scripts.data.submissions.assignment_data[0].due_date) {
                                    temp2 = temp2.replace("{{students.ontime}}", "Ontime");
                                    temp2 = temp2.replace("{{bg_color}}", "#2A9D8F");
                                }
                                else
                                {
                                    temp2 = temp2.replace("{{students.ontime}}", "Delayed");
                                    temp2 = temp2.replace("{{bg_color}}", "#EF476F");
                                    // studentEntries.classList.add('late');
                                }
                                temp2 = temp2.replace(/{{sa.accuracy}}/g, e.evaluation.accuracy * 10);
                                temp2 = temp2.replace(/{{sa.efficiency}}/g, e.evaluation.efficiency * 10);
                                temp2 = temp2.replace(/{{sa.score}}/g, e.evaluation.score * 10);
                                temp2 = temp2.replace("{{assignments.pending.difficulty}}", e.difficulty);
                                temp2 = temp2.replace(/{{assignments.completed.aid}}/g, e.aid);
                                temp2 = temp2.replace(/{{submission_id}}/g,e.id)
                                temp2 = temp2.replace(/{{student_id}}/g,e.student_id)
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
                    let newUrl = new URL(window.location.href);
                    let institute_id = newUrl.searchParams.get("institute_id")
                    let teacher_id = newUrl.searchParams.get('teacher_id');
                    // let aid = newUrl.searchParams.get('aid');
                    fetch(`https://backend.edu.codemate.ai/teacher/get_assignments?institute_id=${institute_id}&teacher_id=${teacher_id}`)
                    .then((res) => res.json())
                    .then((res) => {
                        env.scripts.data.studentwise = res
                       
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
                        
                            if(env.scripts.data.studentwise.submissions !== null) {
                                env.scripts.data.studentwise.submissions.forEach((e) => {
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
                                  temp2 = temp2.replace("{{submission_id}}",e.id)
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
            "assignments": async () => {
    try {
        const assignResponse = await fetch("./components/assignments.cmfe");
        const assign = await assignResponse.text();

        let newUrl = new URL(window.location.href);
        let institute_id = newUrl.searchParams.get("institute_id");
        let teacher_id = newUrl.searchParams.get('teacher_id');

        const assignmentsResponse = await fetch(`https://backend.edu.codemate.ai/teacher/get_assignments?institute_id=${institute_id}&teacher_id=${teacher_id}`);
        const assignmentsData = await assignmentsResponse.json();
        env.scripts.data.assignments = assignmentsData;
        console.log(assignmentsData);

        let assignments__sa = "";
        let sortedAssignments = env.scripts.data.assignments.assignments.slice().reverse();

        for (const e of sortedAssignments) {
            const submissionsUrl = `https://backend.edu.codemate.ai/teacher/get_submissions?institute_id=${institute_id}&teacher_id=${teacher_id}&assignment_id=${e.id}`;
            const submissionsResponse = await fetch(submissionsUrl);
            const submissionsResp = await submissionsResponse.json();

            let temp = assign_teachers.pending;
            temp = temp.replace("{{assignments.pending.title}}", e.title);
            temp = temp.replace("{{assignments.pending.description}}", e.description);

            // Convert unix timestamp to date string
            let unixTimestamp = e.due_date;
            let dateObj = new Date(unixTimestamp * 1000);
            let utcString = dateObj.toUTCString();
            temp = temp.replace("{{assignments.pending.due_date}}", utcString);
            temp = temp.replace("{{assignments.pending.difficulty}}", e.difficulty);
            temp = temp.replace("{{assignments.pending.submissions}}", submissionsResp.submissions.length);

            // Calculate pending submissions
            let uniqueStudentIds = new Set();
            submissionsResp.submissions.forEach(submission => {
                uniqueStudentIds.add(submission.student_id);
            });

            let totalStudents = env.scripts.data.assignments.students.length;
            let pending = totalStudents - uniqueStudentIds.size;
            pending = pending < 0 ? 0 : pending; // Ensure pending is not negative
            temp = temp.replace("{{assignments.pending.yet}}", pending);
            temp = temp.replace("{{assignment_id}}", e.id);

            assignments__sa += temp;
        }

        const finalAssign = assign.replace("{{data}}", assignments__sa);
        env.app.innerHTML = finalAssign;
        env.scripts.elements.assignments = document.createElement("script");
        env.scripts.elements.assignments.src = env.scripts.paths.assignments;
        env.app.appendChild(env.scripts.elements.assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
    }
},
            "view" : () => {
                fetch("./components/view.cmfe")
                .then((view) => view.text())
                .then((view) => {
                        const queryParams = new URL(window.location.href);
                        const institute_id = queryParams.searchParams.get('institute_id');
                        const assignment_id = queryParams.searchParams.get('assignment_id') 
                        fetch(`https://backend.edu.codemate.ai/share?institute_id=${institute_id}&assignment_id=${assignment_id}`)
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
            },
            "profile" : () => {
                fetch("./components/profile.cmfe")
                    .then((profile) => profile.text())
                    .then((profile) => {
                        env.scripts.elements.profile = document.createElement("script");
                        env.scripts.elements.profile.src = env.scripts.paths.profile;
                        return profile;
                    })
                    .then((profile) => {
                        var elm = document.createElement("script");
                        elm.src = env.scripts.paths.profile
                        document.body.appendChild(elm);
                        return profile
                    })
                    .then((profile) => {
                     
                            env.app.innerHTML = profile;
                            env.app.appendChild(env.scripts.elements.profile);
                   
                    })
            }
        }
    }
}












env.init();