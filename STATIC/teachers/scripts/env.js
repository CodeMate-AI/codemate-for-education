const env = {
    "active_page": null,
    "app": document.getElementById("app"),
    "scripts": {
        "paths": {
            "dash": "./components/dash.js",
            // "playground": "./components/playground.js",
            "assignments": "./components/create.js",
            "unchecked": "./components/unchecked.js",
            "studentwise": "./components/studentwise.js"
        },
        "elements": {
            "dash": null,
            "assignments": null,
            "unchecked": null,
            "studentwise": null,
        },
        "data": {
            "dash": null,
            "assignments": null,
            "unchecked" : null,
            "studentwise": null,
        }
    },
    "messages": [],
    "init": () => {
        let url = new URL(window.location.href);
        env.active_page = url.searchParams.get('app');
        if (env.active_page === null || env.active_page === undefined || env.active_page !== env.scripts.paths ) {
            env.active_page = "dash";
        }
        if (document.querySelector(".nav_elm_active")) {
            document.querySelector(".nav_elm_active").classList.remove("nav_elm_active");
        }
        document.querySelector(`[nav="${env.active_page}"]`).classList.add("nav_elm_active");
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
                        fetch("../db.json")
                            .then((resp) => resp.json())
                            .then((resp) => {
                                env.scripts.data.dash = resp.teachers;
                                console.log(env.scripts.data.dash.assignments.unchecked[0].submissions)
                                dash = dash.replace("{{teacher.students.count}}", resp.teachers.students);
                                dash = dash.replace("{{teacher.assignments}}", resp.teachers.assignment_stats.created);
                                dash = dash.replace("{{teacher.unchecked}}", resp.teachers.assignment_stats.unchecked);
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
                                    var assignments__sa = "";
                                    var uncheckedLength = env.scripts.data.dash.assignments.unchecked.length
                                    env.scripts.data.dash.assignments.unchecked.forEach((e,index) => {
                                        var temp = dash_elm_teachers.pending;
                                        temp = temp.replace("{{assignments.pending.title}}",e.title)
                                        temp = temp.replace("{{assignments.pending.description}}",e.description)
                                        temp = temp.replace("{{assignments.pending.submissions}}",e.submissions.length)
                                        temp = temp.replace("{{assignments.pending.yet}}",env.scripts.data.dash.students - e.submissions.length)
                                        temp = temp.replace("{{assignment_id}}",e.aid)
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
            "playground": () => {
                fetch("./components/playground.cmfe")
                    .then((play) => play.text())
                    .then((playground) => {
                        env.app.innerHTML = playground;
                        var script = document.createElement("script");
                        script.src = env.scripts.paths.playground;
                        document.body.appendChild(script);
                    })
            },
            "assignments": () => {
                const queryParams = new URL(window.location.href);
                const mode = queryParams.searchParams.get('mode'); 
                console.log(mode);
            
                let createFile;
                if (mode === 'self') {
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
                        env.scripts.elements.assignments = document.createElement("script");
                        env.scripts.elements.assignments.src = env.scripts.paths.assignments;
                        return create;
                    })
                    .then((create) => {
                        var elm = document.createElement("script");
                        elm.src = env.scripts.paths.assignments
                        document.body.appendChild(elm);
                        return create
                    })
                    .then((create) => {
                     
                            env.app.innerHTML = create;
                            env.app.appendChild(env.scripts.elements.assignments);
                   
                    })
            },
            "unchecked" : () => {
                fetch("./components/unchecked.cmfe")
                .then((unchecked) => unchecked.text())
                .then((unchecked) => {
                    fetch("../db.json")
                    .then((res) => res.json())
                    .then((res) => {
                        env.scripts.data.unchecked = res.teachers
                        console.log(res.teachers)
                    }).then(() => {
                        env.scripts.elements.unchecked = document.createElement("script")
                        env.scripts.elements.unchecked.src = env.scripts.paths.unchecked
                    })
                    .then(() => {
                        var elm = document.createElement("script");
                        elm.src = env.scripts.paths.unchecked
                        document.body.appendChild(elm);
                    }).then(() => {
                        setTimeout(() => {
                             let unchecked__ = "";
                            //  let assignment__ = ""
                          if(env.scripts.data.unchecked !== null) {
                            env.scripts.data.unchecked.assignments.unchecked[0].submissions.forEach((e) => {
                                var temp2 = uncheck_assign.unchecked;
                        
                                temp2 = temp2.replace("{{students.name}}", e.name);
                                temp2 = temp2.replace("{{students.submitted_on}}", e.submitted_on);
                                if(e.submitted_on <= env.scripts.data.unchecked.assignments.unchecked[0].due_date) {
                                    temp2 = temp2.replace("{{students.ontime}}", "Ontime");
                                } else {
                                    temp2 = temp2.replace("{{students.ontime}}", "Late");
                                }
                                temp2 = temp2.replace("{{assignments.pending.difficulty}}", e.difficulty);
                                temp2 = temp2.replace("{{assignments.pending.aid}}", e.aid);
                                unchecked__ += temp2;
                            });
                          }
        
                            // env.app.innerHTML = assign+assignments_pending;
                            env.app.appendChild(env.scripts.elements.unchecked);
                       
                            unchecked = unchecked.replace("{{data}}", unchecked__);
                            env.app.innerHTML = unchecked
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
            }
        }
    }
}




env.init();