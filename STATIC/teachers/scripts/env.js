const env = {
    "active_page": null,
    "app": document.getElementById("app"),
    "scripts": {
        "paths": {
            // "dash": "./components/dash.js",
            // "playground": "./components/playground.js",
            "assignments": "./components/create.js",
            "unchecked": "./components/unchecked.js",
            "student": "./components/student-wise.js"
        },
        "elements": {
            "dash": null,
            "assignments": null,
            "unchecked": null,
            "student": null,
        },
        "data": {
            "dash": null,
            "assignments": null,
            "unchecked" : null,
            "student": null,
        }
    },
    "messages": [],
    "init": () => {
        let url = new URL(window.location.href);
        env.active_page = url.searchParams.get('app');
        if (env.active_page === null) {
            env.active_page = "assignments";
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
            // "dash": () => {
            //     fetch("./components/dash.cmfe")
            //         .then((dash) => dash.text())
            //         .then((dash) => {
            //             fetch("./components/db.json")
            //                 .then((resp) => resp.json())
            //                 .then((resp) => {
            //                     env.scripts.data.dash = resp;
            //                     dash = dash.replace("{{assignments.submitted}}", resp.assignment_stats.submitted);
            //                     dash = dash.replace("{{assignments.pending}}", resp.assignment_stats.pending);
            //                     dash = dash.replace("{{proficiency}}", resp.proficiency);
            //                     return dash;
            //                 }).then((dash) => {
            //                     env.scripts.elements.dash = document.createElement("script");
            //                     env.scripts.elements.dash.src = env.scripts.paths.dash;
            //                 }).then(() => {
            //                     var elm = document.createElement("script");
            //                     elm.src = env.scripts.paths.dash;
            //                     document.body.appendChild(elm);
            //                 }).then(() => {
            //                     setTimeout(() => {
            //                         var assignments__sa = "";

            //                         env.scripts.data.dash.assignments.submitted.forEach((e) => {
            //                             var temp = dash_elms.submitted_assignment;
            //                             temp = temp.replace("{{sa.title}}", e.title);
            //                             temp = temp.replace("{{sa.task}}", e.description);
            //                             if (e.status == "pending") {
            //                                 temp = temp.replace("{{sa.stat}}", dash_elms.submitted_assignment_stats.pending);
            //                                 temp = temp.replace("{{sa.donwload.report}}", "sa_rept_disabled");
            //                             } else {
            //                                 temp = temp.replace("{{sa.stat}}", dash_elms.submitted_assignment_stats.success);
            //                                 temp = temp.replace("{{sa.donwload.report}}", "");
            //                             }

            //                             assignments__sa += temp;
            //                         });

            //                         dash = dash.replace("{{sa.stat}}", assignments__sa);
            //                         // console.log(dash);
            //                         env.app.innerHTML = dash;
            //                         env.app.appendChild(env.scripts.elements.dash);
            //                         setTimeout(() => {
            //                             fillContainerWithDivs('presenter');
            //                         }, 100);
            //                     }, 100);
            //                 })
            //                 .then(() => {
            //                     var int___ = setInterval(() => {
            //                         if (document.getElementsByClassName("success_acc__").length > 0) {
            //                             console.log("FK I AM HERE!")
            //                             var success_elms = {
            //                                 "acc": document.querySelectorAll(".success_acc__"),
            //                                 "eff": document.querySelectorAll(".success_eff__"),
            //                                 "scr": document.querySelectorAll(".success_scr__")
            //                             };

            //                             console.log(success_elms);

            //                             var counter = 0;

            //                             env.scripts.data.dash.assignments.submitted.forEach((e) => {
            //                                 if (e.status == "completed") {
            //                                     var sa__upss = new ProgressBar.Circle(success_elms.acc[counter], {
            //                                         color: '#aaa',
            //                                         // This has to be the same size as the maximum width to
            //                                         // prevent clipping
            //                                         strokeWidth: 4,
            //                                         trailWidth: 10,
            //                                         easing: 'easeInOut',
            //                                         duration: 1400,
            //                                         text: {
            //                                             autoStyleContainer: false
            //                                         },
            //                                         from: { color: '#2A9D8F', width: 10 },
            //                                         to: { color: '#2A9D8F', width: 10 },
            //                                         // Set default step function for all animate calls
            //                                         step: function (state, circle) {
            //                                             circle.path.setAttribute('stroke', state.color);
            //                                             circle.path.setAttribute('stroke-width', state.width);

            //                                             var value = Math.round(circle.value() * 100);
            //                                             if (value === 0) {
            //                                                 circle.setText('');
            //                                             } else {
            //                                                 circle.setText(value);
            //                                             }

            //                                         }
            //                                     });
            //                                     // sa__upss.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
            //                                     sa__upss.text.style.fontSize = '1rem';

            //                                     sa__upss.animate(e.stats.accuracy);




            //                                     var sa__eff___ = new ProgressBar.Circle(success_elms.eff[counter], {
            //                                         color: '#aaa',
            //                                         strokeWidth: 4,
            //                                         trailWidth: 10,
            //                                         easing: 'easeInOut',
            //                                         duration: 1400,
            //                                         text: {
            //                                             autoStyleContainer: false
            //                                         },
            //                                         from: { color: '#2A9D8F', width: 10 },
            //                                         to: { color: '#2A9D8F', width: 10 },
            //                                         // Set default step function for all animate calls
            //                                         step: function (state, circle) {
            //                                             circle.path.setAttribute('stroke', state.color);
            //                                             circle.path.setAttribute('stroke-width', state.width);

            //                                             var value = Math.round(circle.value() * 100);
            //                                             if (value === 0) {
            //                                                 circle.setText('');
            //                                             } else {
            //                                                 circle.setText(value);
            //                                             }

            //                                         }
            //                                     });
            //                                     // sa__eff___.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
            //                                     sa__eff___.text.style.fontSize = '1rem';

            //                                     sa__eff___.animate(e.stats.efficiency);






            //                                     var sa__scr___ = new ProgressBar.Circle(success_elms.scr[counter], {
            //                                         color: '#aaa',
            //                                         // This has to be the same size as the maximum width to
            //                                         // prevent clipping
            //                                         strokeWidth: 4,
            //                                         trailWidth: 10,
            //                                         easing: 'easeInOut',
            //                                         duration: 1000,
            //                                         text: {
            //                                             autoStyleContainer: false
            //                                         },
            //                                         from: { color: '#2A9D8F', width: 10 },
            //                                         to: { color: '#2A9D8F', width: 10 },
            //                                         // Set default step function for all animate calls
            //                                         step: function (state, circle) {
            //                                             circle.path.setAttribute('stroke', state.color);
            //                                             circle.path.setAttribute('stroke-width', state.width);

            //                                             var value = Math.round(circle.value() * 100);
            //                                             if (value === 0) {
            //                                                 circle.setText('');
            //                                             } else {
            //                                                 circle.setText(value);
            //                                             }

            //                                         }
            //                                     });
            //                                     // sa__scr___.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
            //                                     sa__scr___.text.style.fontSize = '1rem';

            //                                     sa__scr___.animate(e.stats.score);



            //                                     counter += 1;
            //                                 }
            //                             })

            //                             clearInterval(int___);
            //                         }
            //                     }, 500);
            //                 })
            //         })
            // },
            // "playground": () => {
            //     fetch("./components/playground.cmfe")
            //         .then((play) => play.text())
            //         .then((playground) => {
            //             env.app.innerHTML = playground;
            //             var script = document.createElement("script");
            //             script.src = env.scripts.paths.playground;
            //             document.body.appendChild(script);
            //         })
            // },
            "assignments": () => {
                fetch("./components/create.cmfe")
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
            "student" : () => {
                fetch("./components/student-wise.cmfe")
                .then((student) => student.text())
                .then((student) => {
                    fetch("../db.json")
                    .then((res) => res.json())
                    .then((res) => {
                        env.scripts.data.student = res.teachers
                        console.log(res.teachers)
                    }).then(() => {
                        env.scripts.elements.student = document.createElement("script")
                        env.scripts.elements.student.src = env.scripts.paths.student
                    })
                    .then(() => {
                        var elm = document.createElement("script");
                        elm.src = env.scripts.paths.student
                        document.body.appendChild(elm);
                    }).then(() => {
                        setTimeout(() => {
                             let unchecked__ = "";
                            //  let assignment__ = ""
                          if(env.scripts.data.student !== null) {
                            env.scripts.data.student.assignments.checked[0].submissions.forEach((e) => {
                                var temp2 = uncheck_assign.unchecked;
                        
                                temp2 = temp2.replace("{{students.name}}", e.name);
                                temp2 = temp2.replace("{{students.submitted_on}}", e.submitted_on);
                                if(e.submitted_on <= env.scripts.data.student.assignments.checked[0].due_date) {
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
                       
                            unchecked = student.replace("{{data}}", unchecked__);
                            env.app.innerHTML = unchecked
                        }, 100);
                    })
                })
            }
        }
    }
}




env.init();