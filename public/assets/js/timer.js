/**************/


function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');
    clock.style.display = 'block';

    function updateClock() {
        var t = getTimeRemaining(endtime);

        //daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            clearInterval(timeinterval);
        }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}

var startDate = new Date("May 16, 2016 11:45:00");
var deadline = new Date("May 20, 2016 09:45:00");
var schedule = [
    [startDate, deadline]

];
//var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
//var deadline = new Date(deadline);
//initializeClock('clockdiv', deadline);
// iterate over each element in the schedule
for (var i = 0; i < schedule.length; i++) {
    var startDate = schedule[i][0];
    var endDate = schedule[i][1];

    // put dates in milliseconds for easy comparisons
    var startMs = Date.parse(startDate);
    var endMs = Date.parse(endDate);
    var currentMs = Date.parse(new Date());

    // if current date is between start and end dates, display clock
    if (endMs > currentMs && currentMs >= startMs) {
        $.ajax({
            url: "/timerFlag", success: function (result) {
                console.log(result);
                if (result === "on") {
                    initializeClock('clockdiv', endDate);
                }
            }
        });

    }
}
//# sourceURL=pen.js
