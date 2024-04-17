const env = {
    "active_page": null,
    "app": document.getElementById("app"),
    "scripts": {
        "paths": {
            // "dash": "./components/dash.js",
            // "playground": "./components/playground.js",
            "assignments": "./components/create.js"
        },
        "elements": {
            "dash": null,
            "assignments": null,
        },
        "data": {
            "dash": null,
            "assignments": null,
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
                        console.log(create);
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
                    // .then((assign) => {
                    //     fetch("./components/db.json")
                    //         .then((resp) => resp.json())
                    //         .then((resp) => {
                    //             env.scripts.data.assignments = resp;
                    //             // assign = assign.replace("{{assignments.pending}}", resp.assignments.pending);
                            
                    //             // return assign
                    //         }).then((assign) => {
                    //             env.scripts.elements.assignments = document.createElement("script");
                    //             env.scripts.elements.assignments.src = env.scripts.paths.assignments;
                    //         }).then(() => {
                    //             var elm = document.createElement("script");
                    //             elm.src = env.scripts.paths.assignments;
                    //             document.body.appendChild(elm);
                    //         }).then(() => {
                    //             setTimeout(() => {
                    //                  let assignments_pending = "";
                    
                    //                 env.scripts.data.assignments.assignments.pending.forEach((e) => {
                    //                     var temp2 = pa_elm.pending;
                                
                    //                     temp2 = temp2.replace("{{assignments.pending.title}}", e.title);
                    //                     temp2 = temp2.replace("{{assignments.pending.description}}", e.description);
                    //                     temp2 = temp2.replace("{{assignments.pending.due_date}}", e.due_date);
                    //                     temp2 = temp2.replace("{{assignments.pending.difficulty}}", e.difficulty);
                    //                     temp2 = temp2.replace("{{assignments.pending.aid}}", e.aid);
                    //                     assignments_pending += temp2;
                    //                 });
                
                    //                 // env.app.innerHTML = assign+assignments_pending;
                    //                 env.app.appendChild(env.scripts.elements.assignments);
                               
                    //                 assign = assign.replace("{{assignments.pending}}", assignments_pending);
                    //                 env.app.innerHTML = assign
                    //             }, 100);
                    //         })
                    // })
            }
        }
    }
}




env.init();