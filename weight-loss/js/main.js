document.addEventListener("DOMContentLoaded", function(event) { makeGraphs() });
var weightChart;
var muscleMassPercChart;
var waterPercChart;
var bodyFatMassChart;
var proteinChart;
var boneMassChart;
var bmrChart;
var bodyAgeChart;
var bmiChart;
var bodyFatKgChart;
var boneMassKgChart;
var muscleMassKgChart;
var visceralFatChart;

function setFromTodayMinusDays(days) {
    var to_date = new Date();
    var to_date = new Date(to_date.setDate(to_date.getDate() + 1));

    var from_date = new Date();
    var from_date = new Date(from_date.setDate(from_date.getDate() - days));

    document.getElementById("toDate").value = to_date.toISOString().split('T')[0];
    document.getElementById("fromDate").value = from_date.toISOString().split('T')[0];
    dateChanged();
}

function dateChanged() {
    getDataAndUpdateCharts();
}

function getCurrentFromDate() {
    return document.getElementById("fromDate").value + "T00:00:00Z";
}

function getCurrentToDate() {
    return document.getElementById("toDate").value + "T00:00:00Z";
}

function getDataAndUpdateCharts() {
    fetch('https://kn100.me/w/?from=' + getCurrentFromDate() + "&to=" + getCurrentToDate())
        .then(response => response.json())
        .then(data => updateGraphs(data));
}

function updateGraphs(datasets) {
    // Update from data
    earliest_date = datasets.datasets[0].data[0].x;
    latest_date = datasets.datasets[0].data[datasets.datasets[0].data.length - 1].x;
    ed = new Date(earliest_date);
    ed = ed.toISOString().split('T')[0];
    ld = new Date(latest_date + 86400 * 1000);
    ld = ld.toISOString().split('T')[0];
    document.getElementById("toDate").value = ld;
    document.getElementById("fromDate").value = ed;

    weightChart.data.datasets[0].data = datasets.datasets[0].data;
    weightChart.update();

    muscleMassPercChart.data.datasets[0].data = datasets.datasets[1].data;
    muscleMassPercChart.update();

    waterPercChart.data.datasets[0].data = datasets.datasets[2].data;
    waterPercChart.update();

    bodyFatMassChart.data.datasets[0].data = datasets.datasets[3].data;
    bodyFatMassChart.update();

    proteinChart.data.datasets[0].data = datasets.datasets[4].data;
    proteinChart.update();

    boneMassChart.data.datasets[0].data = datasets.datasets[5].data;
    boneMassChart.update();

    bmrChart.data.datasets[0].data = datasets.datasets[6].data;
    bmrChart.update();

    bodyAgeChart.data.datasets[0].data = datasets.datasets[7].data;
    bodyAgeChart.update();

    bmiChart.data.datasets[0].data = datasets.datasets[8].data;
    bmiChart.update();

    bodyFatKgChart.data.datasets[0].data = datasets.datasets[9].data;
    bodyFatKgChart.update();

    boneMassKgChart.data.datasets[0].data = datasets.datasets[10].data;
    boneMassKgChart.update();

    muscleMassKgChart.data.datasets[0].data = datasets.datasets[12].data;
    muscleMassKgChart.update();

    visceralFatChart.data.datasets[0].data = datasets.datasets[13].data;
    visceralFatChart.update();
    weight_loss_total = datasets.datasets[0].data[datasets.datasets[0].data.length - 1].y - datasets.datasets[0].data[0].y
    weight_loss_total = parseInt(weight_loss_total * 10) / 10;
    document.getElementById("wlamt").innerHTML = weight_loss_total + " kg";

    numDaysBetweenDate = datediff(getCurrentFromDate(), getCurrentToDate());
    avgWeightLossDay = ((weight_loss_total / numDaysBetweenDate));
    avgWeightLossWeek = parseInt(((weight_loss_total / numDaysBetweenDate) * 7) * 100) / 100;
    document.getElementById("wlavg").innerHTML = avgWeightLossWeek + " kg";

    weightLeftToLose = datasets.datasets[0].data[datasets.datasets[0].data.length - 1].y - 75
    daysUntil75 = parseInt(weightLeftToLose / Math.abs(avgWeightLossDay));
    document.getElementById("wldgl").innerHTML = daysUntil75;
}

function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    first = Date.parse(first);
    second = Date.parse(second);
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function makeGraphs() {
    var weightChartContext = document.getElementById('weightChartCanvas').getContext('2d');
    weightChart = new Chart(weightChartContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
                y: {}
            }
        },
        data: {
            datasets: [{
                label: 'Weight (Kg)',
                borderColor: 'rgb(152, 217, 194)',
                backgroundColor: 'rgba(152, 217, 194, 0.2)',
                fill: true,
            }]
        }
    });
    var muscleMassPercChartContext = document.getElementById('muscleMassPercChartCanvas').getContext('2d');
    muscleMassPercChart = new Chart(muscleMassPercChartContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
                y: {}
            }
        },
        data: {
            datasets: [{
                label: 'Muscle Mass (%)',
                borderColor: 'rgb(247,37,133)',
                backgroundColor: 'rgba(247,37,133, 0.2)',
                fill: true,
            }]
        }
    });

    var waterMassPercChartContext = document.getElementById('waterMassPercChartCanvas').getContext('2d');
    waterPercChart = new Chart(waterMassPercChartContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
                y: {

                }
            }
        },
        data: {
            datasets: [{
                label: 'Water (%)',
                borderColor: 'rgb(58,12,163)',
                backgroundColor: 'rgba(58,12,163, 0.2)',
                fill: true,

            }]
        }
    });
    var bodyFatMassPercChartContext = document.getElementById('bodyFatMassPercChartCanvas').getContext('2d');
    bodyFatMassChart = new Chart(bodyFatMassPercChartContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
                y: {}
            }
        },
        data: {
            datasets: [{
                label: 'Body fat (%)',
                borderColor: 'rgb(67,97,238)',
                backgroundColor: 'rgba(67,97,238, 0.2)',
                fill: true,
            }]
        }
    });

    var proteinPercChartContext = document.getElementById('proteinPercChartCanvas').getContext('2d');
    proteinChart = new Chart(proteinPercChartContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
                y: {}
            }
        },
        data: {
            datasets: [{
                label: 'Protein (%)',
                borderColor: 'rgb(67,97,238)',
                backgroundColor: 'rgba(67,97,238, 0.2)',
                fill: true,
            }]
        }
    });

    var boneMassPercChartContext = document.getElementById('boneMassPercChartCanvas').getContext('2d');
    boneMassChart = new Chart(boneMassPercChartContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
            }
        },
        data: {
            datasets: [{
                label: 'Protein (%)',
                borderColor: 'rgb(67,97,238)',
                backgroundColor: 'rgba(67,97,238, 0.2)',
                fill: true,
            }]
        }
    });

    var basalMetabolicRateChartContext = document.getElementById('basalMetabolicRateChartCanvas').getContext('2d');
    bmrChart = new Chart(basalMetabolicRateChartContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
                y: {}
            }
        },
        data: {
            datasets: [{
                label: 'Basal Metabolic Rate',
                borderColor: 'rgb(67,97,238)',
                backgroundColor: 'rgba(67,97,238, 0.2)',
                fill: true,
            }]
        }
    });

    var bodyAgeContext = document.getElementById('bodyAgeCanvas').getContext('2d');
    bodyAgeChart = new Chart(bodyAgeContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
            }
        },
        data: {
            datasets: [{
                label: 'Body Age',
                borderColor: 'rgb(67,97,238)',
                backgroundColor: 'rgba(67,97,238, 0.2)',
                fill: true,
            }]
        }
    });

    var bmiContext = document.getElementById('bmiCanvas').getContext('2d');
    bmiChart = new Chart(bmiContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
                y: {}
            }
        },
        data: {
            datasets: [{
                label: 'BMI',
                borderColor: 'rgb(67,97,238)',
                backgroundColor: 'rgba(67,97,238, 0.2)',
                fill: true,
            }]
        }
    });

    var bodyFatKgContext = document.getElementById('bodyFatKgCanvas').getContext('2d');
    bodyFatKgChart = new Chart(bodyFatKgContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
            }
        },
        data: {
            datasets: [{
                label: 'Body Fat (Kg)',
                borderColor: 'rgb(67,97,238)',
                backgroundColor: 'rgba(67,97,238, 0.2)',
                fill: true,
            }]
        }
    });

    var boneMassKgContext = document.getElementById('boneMassKgCanvas').getContext('2d');
    boneMassKgChart = new Chart(boneMassKgContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                }
            }
        },
        data: {
            datasets: [{
                label: 'Bone Mass (Kg)',
                borderColor: 'rgb(67,240,70)',
                backgroundColor: 'rgba(67,240,70, 0.2)',
                fill: true,
            }]
        }
    });

    var muscleMassKgContext = document.getElementById('muscleMassKgCanvas').getContext('2d');
    muscleMassKgChart = new Chart(muscleMassKgContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
            }
        },
        data: {
            datasets: [{
                label: 'Muscle Mass (Kg)',
                borderColor: 'rgb(187,97,238)',
                backgroundColor: 'rgba(187,97,238, 0.2)',
                fill: true,
            }]
        }
    });

    var visceralFatChartContext = document.getElementById('visceralFatChartCanvas').getContext('2d');
    visceralFatChart = new Chart(visceralFatChartContext, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                },
            }
        },
        data: {
            datasets: [{
                label: 'Visceral Fat (?)',
                borderColor: 'rgb(187,97,238)',
                backgroundColor: 'rgba(187,97,238, 0.2)',
                fill: true,
            }]
        }
    });
    setFromTodayMinusDays(9000);
    getDataAndUpdateCharts();
}
