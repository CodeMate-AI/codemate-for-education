
//sometimes dash_elms becoming undefined so lets also keep it here for reducing such chances
dash_elms = {
    "submitted_assignment": `<div class='sa__'>
                        <div class="sa_ds">
                            <span>{{sa.title}}</span>
                            <div class="desc_task">{{sa.task}}</div>
                        </div>
                        <div class="sa_an">{{sa.stat}}</div>
                        <div class="sa_cl">
                            <div class="sa_rept tooltip" data-tip="View Report" submission_id="{{sa.submission_id}}" assignment_id="{{sa.assignment_id}}">
                                <i class="ph-fill cursor-pointer ph-cloud-arrow-down {{sa.donwload.report}}"></i>
                            </div>
                           <!-- <div class="sa_view-sa tooltip" data-tip="View Submission">
                                <i class="ph ph-info"></i>
                            </div>-->
                        </div>
                    </div>`,

    "submitted_assignment_stats": {
        "pending": `<div class="sa_stat_pending">
                        <i class="ph-fill ph-clock"></i>
                        <span>Yet To Evaluate</span>
                    </div>`,

        "success": `<div class="sa_stat_success">
                        <div class="success_acc__"></div>
                        <div class="success_eff__"></div>
                        <div class="success_scr__"></div>
                    </div>`
    }
}

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

        if(env.active_page === "dash")
        setTimeout(() => {
            const dashboardElement = document.getElementById('dashboard');
            if (dashboardElement) {
                dashboardElement.click(); // Trigger a click event on the dashboardElement
            }
        }, 1500); // 1500 milliseconds


        if (env.active_page === null) {
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
                console.log("clicked")
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
                        let newUrl = new URL(window.location.href);
                        let institute_id = newUrl.searchParams.get("institute_id")
                        let student_id = newUrl.searchParams.get('student_id');

                        
                        fetch(`https://backend.edu.codemate.ai/student/get_assignments?institute_id=${institute_id}&student_id=${student_id}`)
                            .then((resp) => resp.json())
                            .then((resp) => {
                                env.scripts.data.dash = resp;
                                console.log("resp=",resp);
                                dash = dash.replace("{{assignments.submitted}}", resp.submissions.length);
                                dash = dash.replace("{{assignments.pending}}", resp.assigned.length);
                                dash = dash.replace("{{proficiency}}", ((resp.submissions.length / resp.assigned.length) * 100).toFixed(2));
                                return dash;
                            }).then((dash) => {
                                env.scripts.elements.dash = document.createElement("script");
                                env.scripts.elements.dash.src = env.scripts.paths.dash;
                            }).then(() => {
                                var elm = document.createElement("script");
                                elm.src = env.scripts.paths.dash;
                                document.getElementById("app").appendChild(elm);
                            }).then(() => {
                                setTimeout(() => {
                                    var assignments__sa = "";
                                    console.log("env.scripts.data.dash=",env.scripts.data.dash)
                                   if(env.scripts.data.dash.submissions.length !== 0) {
                                       if (dash_elms !== undefined) {
                                        env.scripts.data.dash.submissions.sort((a, b) => {
                                            return new Date(b.date_time) - new Date(a.date_time);
                                        });
                                        env.scripts.data.dash.submissions.slice(2, 5).forEach((e) => {
                                            console.log("e=",e);
                                            // console.log(e.assignment.id);
                                            var temp = dash_elms.submitted_assignment;
                                            temp = temp.replace("{{sa.title}}", e.assignment.title);
                                            temp = temp.replace("{{sa.task}}", e.assignment.description);
                                            temp = temp.replace("{{sa.submission_id}}", e.id);
                                            // temp = temp.replace("{{sa.assignment_id}}", e.assignment.id);
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
                                    env.app.innerHTML = dash;
                                    env.app.appendChild(env.scripts.elements.dash);
                                   } else {
                                    dash = dash.replace("{{sa.stat}}", `<p>Nothing to show here :)</p>`);
                                    env.app.innerHTML = dash;
                                    env.app.appendChild(env.scripts.elements.dash);
                                   }
                                    // console.log(dash);
                                   
                                    setTimeout(() => {
                                        if(typeof fillContainerWithDivs === 'function')
                                        fillContainerWithDivs('presenter');
                                        setTimeout(()=>{
                                            document.querySelectorAll(".sa_rept").forEach((e)=>{
                                                e.onclick = ()=>{
                                                    window.open(`../report/?submission_id=${e.getAttribute('submission_id')}`, '_blank');
                                                }
                                            })
                                        }, 100);
                                    }, 100);
                                }, 100);
                            })
                            .then(() => {
                                var int___ = setInterval(() => {
                                    if (document.getElementsByClassName("success_acc__").length > 0) {
                                        var success_elms = {
                                            "acc": document.querySelectorAll(".success_acc__"),
                                            "eff": document.querySelectorAll(".success_eff__"),
                                            "scr": document.querySelectorAll(".success_scr__")
                                        };

                                        console.log(success_elms);

                                        var counter = 0;
                                        console.log("env.scripts.data.dash.submissions (for boxes)=",env.scripts.data.dash.submissions)
                                        env.scripts.data.dash.submissions.forEach((e) => {
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
                        let newUrl = new URL(window.location.href);
                        // let assignment_id = newUrl.searchParams.get('assignment_id');
                        let student_id= newUrl.searchParams.get('student_id')
                        fetch(`https://backend.edu.codemate.ai/student/get_assignments?institute_id=123456&student_id=${student_id}`)
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
                                    console.log(env.scripts.data.assignments);
                                    let newUrl = new URL(window.location.href);
                                    let assignment = newUrl.searchParams.get('assignment');
                                    // sort the submissions array by date_time in descending order (most recent first)
            env.scripts.data.assignments.submissions.sort((a, b) => {
                return new Date(b.date_time) - new Date(a.date_time);
            });
                                    if (assignment === "Completed") {
                                        env.scripts.data.assignments.submissions.slice(2).forEach((e) => {
                                            var temp2 = pa_elm.completed;

                                            console.log(e);
                                    
                                            temp2 = temp2.replace("{{assignments.completed.title}}", e.assignment.title);
                                            temp2 = temp2.replace("{{assignments.completed.description}}", e.assignment.description);
                                            temp2 = temp2.replace("{{assignments.completed.submit_date}}", e.date_time);
                                            temp2 = temp2.replace("{{assignments.completed.id}}", e.id);
                                            temp2 = temp2.replace("{{assignments.completed.aid}}", e.assignment.id);
                                         
                                            assignments_pending += temp2;
                                        });
                                    } else {
                                        //sort such that most recent appear first
                                        env.scripts.data.assignments.assigned.sort((a, b) => {
                                            return new Date(parseInt(b.due_date) * 1000) - new Date(parseInt(a.due_date) * 1000);
                                        });
                                        // create an array of all aid values from the submissions array.
let submittedAssignmentIds = env.scripts.data.assignments.submissions.map(submission => submission.aid);

// filter the assigned array to include only those assignments
// whose id is not found in the submittedAssignmentIds array.
let unsubmittedAssignments = env.scripts.data.assignments.assigned.filter(assignment => {
    return !submittedAssignmentIds.includes(assignment.id);
});

//so initally we were using assigned array but we need the pending ones so simply remove the ones which are submitted
unsubmittedAssignments.forEach((e) => {
                                            var temp2 = pa_elm.pending;
                                            console.log(e);
                                    
                                            temp2 = temp2.replace("{{assignments.pending.title}}", e.title);
                                            temp2 = temp2.replace("{{assignments.pending.description}}", e.description);
                                            temp2 = temp2.replace("{{assignments.pending.due_date}}", new Date(parseInt(e.due_date) * 1000).toLocaleString());
                                            temp2 = temp2.replace("{{assignments.pending.difficulty}}", e.difficulty);
                                            temp2 = temp2.replace("{{assignments.pending.aid}}", e.id);
                                        
                                            assignments_pending += temp2;
                                        });
                                    }
                
                                    // env.app.innerHTML = assign+assignments_pending;
                                    env.app.appendChild(env.scripts.elements.assignments);
                               
                                    assign = assign.replace("{{assignments.pending}}", assignments_pending);
                                    env.app.innerHTML = assign
                                    
                                    if (assignment === "Completed") {
                                        document.getElementById("pending_btn").style.backgroundColor = "#f7f7f7";
                                        document.getElementById("pending_btn").style.color = "black";
                                        document.getElementById("pending_btn").style.border = "1px solid #dddddd";
                                        document.getElementById("completed_btn").style.backgroundColor = "#010536";
                                        document.getElementById("completed_btn").style.color = "white";
                                    }
                                    else {
                                        document.getElementById("pending_btn").style.backgroundColor = "#010536";
                                        document.getElementById("pending_btn").style.color = "white";
                                        document.getElementById("pending_btn").style.border = "none";
                                        document.getElementById("completed_btn").style.backgroundColor = "#f7f7f7";
                                        document.getElementById("completed_btn").style.color = "black";
                                    }
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
                        fetch(`https://backend.edu.codemate.ai/student/get_assignment?institute_id=123456&assignment_id=${assignment_id}&student_id=001`)
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