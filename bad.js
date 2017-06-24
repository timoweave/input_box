"use strict";

(() => {

    jQuery.support.cors = true;

    const us = {
        states : {
            ids : [
                "01", "02", "04", "05", "06", "08", "09",
                "10", "11", "12", "13", "15", "16", "17", "18", "19",
                "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
                "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
                "40", "41", "42", "44", "45", "46", "47", "48", "49",
                "50", "51", "53", "54", "55", "56",
                "72"
            ],
            populations : []
        },
        total_population : 0,
        largest : {
            population : 0,
            state : "",
            id : ""
        }
    };

    $(document).ready(() => (get_population(us)));
    $("#find").on("click", () => (update_population(us)));
    $("#reset").on("click", () => (reset_population(us)));

    function get_population(us) {
        reset_population(us);
        setTimeout(() => {
            update_population(us);
        }, 500);
    }

    function reset_population(us) {
        us.states.populations = [];
        us.total_population = 0;
        us.largest.population = 0;
        us.largest.state = "";
        us.largest.id = "";

        $("#total").text("...");
        $("#largest").text("...");

        $("#population_progress")
            .attr("aria-valuenow", "0")
            .css("width", "0%")
            .text("0%");
    }

    function update_population(us) {
        us.states.ids.map((state_id, index) => {
            $.get(get_census_url(state_id), function(response) {
                update_us_population(us, response);

                const subtotal = us.states.populations.length;
                const total = us.states.ids.length;
                const progress = Math.round(100*( subtotal / total));
                $("#population_progress")
                    .attr("aria-valuenow", progress)
                    .css("width", progress + "%")
                    .text(progress + "%");

                if (us.states.populations.length === us.states.ids.length) {
                    setTimeout(() => { // sync up with progress bar
                        $("#total").text(format_number(us.total_population));
                        $("#largest").text(format_number(us.largest.population));
                    }, 1000);
                }
            });
        });
    }

    function promise_update_population(us) {
        us.states.ids.reduce((promise, state_id, index) => {
            return promise.then((us) => {
                return new Promise((resolve, reject) => {
                    $.get(get_census_url(state_id), function success(response) {
                        update_us_population(us, response);
                        const subtotal = us.states.populations.length;
                        const total = us.states.ids.length;
                        const progress = Math.round(100*( subtotal / total));
                        $("#population_progress")
                            .attr("aria-valuenow", progress)
                            .css("width", progress + "%")
                            .text(progress + "%");
                        return resolve(us);
                    }).fail(function failed() {
                        return reject(us);
                    });
                });
            });
        }, Promise.resolve(us)).then((us) => {
            setTimeout(() => { // sync up with progress bar
                $("#total").text(format_number(us.total_population));
                $("#largest").text(format_number(us.largest.population));
            }, 1000);
        });
    }

    function update_us_population(us, response) {
        // response = [ ["POP", "GEONAME", "state"], // keys
        //              ["3474182", "Puerto Rico", "72"] ] // values

        const [keys, values] = response;
        const [pop, name, id] = values;

        const population = parseInt(pop);
        us.states.populations.push(values);
        us.total_population = us.total_population + population;
        if (population > us.largest.population) {
            us.largest.population = population;
                us.largest.state = name;
            us.largest.id = id;
        }
        // console.log([pop, name, id, us.largest.state, us.largest.population]);
    }

    function format_number(num) {
        // NOTE: number nnnnnnn -> n,nnn,nnn
        return num
            .toString().split('').reverse().join('')
                .match(/.{1,3}/g).join(',')
            .split('').reverse().join('');
    }

    function get_census_url(state_num) {
        const address = "https://api.census.gov/data/2015/pep/population";
        const params = {
            "key" : '5e562d947f0fb77549cb73938cf1bec320ebe37e',
            "get" : 'POP,GEONAME',
            "for" : "state:" + state_num
        };
        return address + "?" + $.param(params);
    }

})();
