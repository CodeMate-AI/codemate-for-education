const env = {
    "active_page": null,
    "app": document.getElementById("app"),
    "scripts": {
        "paths": {
            "dash": "./components/dash.js",
            "playground": "./components/playground.js",
            "assignments": "./components/assignments.js"
        },
        "elements": {
            "dash": null,
            "assignments": null
        },
        "data": {
            "dash": null,
            "assignments": null
        }
    },
    "messages": [],
    "init": () => {
        let url = new URL(window.location.href);
        env.active_page = url.searchParams.get('app');
        if (env.active_page === null) {
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
                    // newUrl.searchParams.set('id', "123456")
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
                                env.scripts.data.dash = resp;
                                dash = dash.replace("{{assignments.submitted}}", resp.students.assignment_stats.submitted);
                                dash = dash.replace("{{assignments.pending}}", resp.students.assignment_stats.pending);
                                dash = dash.replace("{{proficiency}}", resp.students.proficiency);
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
                                    
                                    if(dash_elms !== undefined) {
                                        env.scripts.data.dash.students.assignments.submitted.forEach((e) => {
                                            var temp = dash_elms.submitted_assignment;
                                            temp = temp.replace("{{sa.title}}", e.title);
                                            temp = temp.replace("{{sa.task}}", e.description);
                                            if (e.status == "pending") {
                                                temp = temp.replace("{{sa.stat}}", dash_elms.submitted_assignment_stats.pending);
                                                temp = temp.replace("{{sa.donwload.report}}", "sa_rept_disabled");
                                            } else {
                                                temp = temp.replace("{{sa.stat}}", dash_elms.submitted_assignment_stats.success);
                                                temp = temp.replace("{{sa.donwload.report}}", "");
                                            }
    
                                            assignments__sa += temp;
                                        });
                                    }  

                                    dash = dash.replace("{{sa.stat}}", assignments__sa);
                                    // console.log(dash);
                                    env.app.innerHTML = dash;
                                    env.app.appendChild(env.scripts.elements.dash);
                                    setTimeout(() => {
                                        fillContainerWithDivs('presenter');
                                    }, 100);
                                }, 100);
                            })
                            .then(() => {
                                var int___ = setInterval(() => {
                                    if (document.getElementsByClassName("success_acc__").length > 0) {
                                        console.log("FK I AM HERE!")
                                        var success_elms = {
                                            "acc": document.querySelectorAll(".success_acc__"),
                                            "eff": document.querySelectorAll(".success_eff__"),
                                            "scr": document.querySelectorAll(".success_scr__")
                                        };

                                        console.log(success_elms);

                                        var counter = 0;

                                        env.scripts.data.dash.students.assignments.submitted.forEach((e) => {
                                            if (e.status == "completed") {
                                                var sa__upss = new ProgressBar.Circle(success_elms.acc[counter], {
                                                    color: '#aaa',
                                                    // This has to be the same size as the maximum width to
                                                    // prevent clipping
                                                    strokeWidth: 4,
                                                    trailWidth: 10,
                                                    easing: 'easeInOut',
                                                    duration: 1400,
                                                    text: {
                                                        autoStyleContainer: false
                                                    },
                                                    from: { color: '#2A9D8F', width: 10 },
                                                    to: { color: '#2A9D8F', width: 10 },
                                                    // Set default step function for all animate calls
                                                    step: function (state, circle) {
                                                        circle.path.setAttribute('stroke', state.color);
                                                        circle.path.setAttribute('stroke-width', state.width);

                                                        var value = Math.round(circle.value() * 100);
                                                        if (value === 0) {
                                                            circle.setText('');
                                                        } else {
                                                            circle.setText(value);
                                                        }

                                                    }
                                                });
                                                // sa__upss.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
                                                sa__upss.text.style.fontSize = '1rem';

                                                sa__upss.animate(e.stats.accuracy);




                                                var sa__eff___ = new ProgressBar.Circle(success_elms.eff[counter], {
                                                    color: '#aaa',
                                                    strokeWidth: 4,
                                                    trailWidth: 10,
                                                    easing: 'easeInOut',
                                                    duration: 1400,
                                                    text: {
                                                        autoStyleContainer: false
                                                    },
                                                    from: { color: '#2A9D8F', width: 10 },
                                                    to: { color: '#2A9D8F', width: 10 },
                                                    // Set default step function for all animate calls
                                                    step: function (state, circle) {
                                                        circle.path.setAttribute('stroke', state.color);
                                                        circle.path.setAttribute('stroke-width', state.width);

                                                        var value = Math.round(circle.value() * 100);
                                                        if (value === 0) {
                                                            circle.setText('');
                                                        } else {
                                                            circle.setText(value);
                                                        }

                                                    }
                                                });
                                                // sa__eff___.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
                                                sa__eff___.text.style.fontSize = '1rem';

                                                sa__eff___.animate(e.stats.efficiency);






                                                var sa__scr___ = new ProgressBar.Circle(success_elms.scr[counter], {
                                                    color: '#aaa',
                                                    // This has to be the same size as the maximum width to
                                                    // prevent clipping
                                                    strokeWidth: 4,
                                                    trailWidth: 10,
                                                    easing: 'easeInOut',
                                                    duration: 1000,
                                                    text: {
                                                        autoStyleContainer: false
                                                    },
                                                    from: { color: '#2A9D8F', width: 10 },
                                                    to: { color: '#2A9D8F', width: 10 },
                                                    // Set default step function for all animate calls
                                                    step: function (state, circle) {
                                                        circle.path.setAttribute('stroke', state.color);
                                                        circle.path.setAttribute('stroke-width', state.width);

                                                        var value = Math.round(circle.value() * 100);
                                                        if (value === 0) {
                                                            circle.setText('');
                                                        } else {
                                                            circle.setText(value);
                                                        }

                                                    }
                                                });
                                                // sa__scr___.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
                                                sa__scr___.text.style.fontSize = '1rem';

                                                sa__scr___.animate(e.stats.score);



                                                counter += 1;
                                            }
                                        })

                                        clearInterval(int___);
                                    }
                                }, 500);
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
                        fetch(`http://localhost:8002/student/get_assignment/?institute_id=123456&assignment_id=${assignment_id}&student_id=001`)
                        .then((res) => res.json())
                        .then((res) => {
                                env.scripts.data.playground = res;
                                console.log(res);
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
                                setTimeout(() => {
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
                                    setTimeout(()=>{
                                        env.app.appendChild(env.scripts.elements.playground);
                                    }, 100);
                                    // playground = playground.replace("{{assignments.pending}}", assignments_pending);
                                }, 100);
                            })
                    })
            },
            "assignments": () => {
                fetch("./components/assignments.cmfe")
                    .then((assign) => assign.text())
                    // .then((assign) => {
                    //     env.app.innerHTML = assign;
                    //     var script = document.createElement("script");
                    //     script.src = env.scripts.paths.assignments;
                    //     document.body.appendChild(script);
                    // })
                    .then((assign) => {
                        fetch("http://localhost:8002/student/get_assignments/?institute_id=123456")
                        .then((res) => res.json())
                        .then((res) => {
                                env.scripts.data.assignments = res;
                                // assign = assign.replace("{{assignments.pending}}", resp.assignments.pending);
                                
                                // return assign
                            }).then((assign) => {
                                env.scripts.elements.assignments = document.createElement("script");
                                env.scripts.elements.assignments.src = env.scripts.paths.assignments;
                            }).then(() => {
                                var elm = document.createElement("script");
                                elm.src = env.scripts.paths.assignments;
                                document.body.appendChild(elm);
                            }).then(() => {
                                setTimeout(() => {
                                     let assignments_pending = "";
                    
                                    env.scripts.data.assignments.assignments.forEach((e) => {
                                        var temp2 = pa_elm.pending;
                                
                                        temp2 = temp2.replace("{{assignments.pending.title}}", e.title);
                                        temp2 = temp2.replace("{{assignments.pending.description}}", e.description);
                                        temp2 = temp2.replace("{{assignments.pending.due_date}}", e.due_date);
                                        temp2 = temp2.replace("{{assignments.pending.difficulty}}", e.difficulty);
                                        temp2 = temp2.replace("{{assignments.pending.aid}}", e.id);
                                    
                                        assignments_pending += temp2;
                                    });
                
                                    // env.app.innerHTML = assign+assignments_pending;
                                    env.app.appendChild(env.scripts.elements.assignments);
                               
                                    assign = assign.replace("{{assignments.pending}}", assignments_pending);
                                    env.app.innerHTML = assign
                                    
                                }, 100);
                            })
                    })
            },
            "solve": () => {
                fetch("./components/solve.cmfe")
                    .then((solve) => solve.text())
                    // .then((assign) => {
                    //     env.app.innerHTML = assign;
                    //     var script = document.createElement("script");
                    //     script.src = env.scripts.paths.assignments;
                    //     document.body.appendChild(script);
                    // })
                    .then((solve) => {
                        let newUrl = new URL(window.location.href);
                        let assignment_id = newUrl.searchParams.get('assignment_id');
                        fetch(`http://localhost:8002/student/get_assignment/?institute_id=123456&assignment_id=${assignment_id}&student_id=001`)
                        .then((res) => res.json())
                        .then((res) => {
                                env.scripts.data.solve = res;
                                console.log(res);
                                // assign = assign.replace("{{assignments.pending}}", resp.assignments.pending);
                                
                                // return assign
                            }).then((solve) => {
                                env.scripts.elements.solve = document.createElement("script");
                                env.scripts.elements.solve.src = env.scripts.paths.solve;
                            }).then(() => {
                                var elm = document.createElement("script");
                                elm.src = env.scripts.paths.solve;
                                document.body.appendChild(elm);
                            }).then(() => {
                                setTimeout(() => {
                                     let assignments_pending = "";
                    
                                    env.scripts.data.solve.assignments.forEach((e) => {
                                        var temp2 = pa_elm.pending;
                                
                                        temp2 = temp2.replace("{{assignments.pending.title}}", e.title);
                                        temp2 = temp2.replace("{{assignments.pending.description}}", e.description);
                                        temp2 = temp2.replace("{{assignments.pending.due_date}}", e.due_date);
                                        temp2 = temp2.replace("{{assignments.pending.difficulty}}", e.difficulty);
                                        temp2 = temp2.replace("{{assignments.pending.aid}}", e.id);
                                    
                                        assignments_pending += temp2;
                                    });
                
                                    // env.app.innerHTML = assign+assignments_pending;
                                    env.app.appendChild(env.scripts.elements.solve);
                               
                                    solve = solve.replace("{{assignments.pending}}", assignments_pending);
                                    env.app.innerHTML = solve
                                    
                                }, 100);
                            })
                    })
            }
        }
    }
}




env.init();