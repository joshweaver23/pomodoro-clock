'use strict';

document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.');
    return;
  }

  if (Notification.permission !== "granted") Notification.requestPermission();
});

$(document).ready(function () {
  // for animation? https://codepen.io/andfinally/pen/OyWGyE?editors=1010
  // cdn: https://cdnjs.cloudflare.com/ajax/libs/jQuery-Knob/1.2.13/jquery.knob.min.js
  // http://anthonyterrien.com/knob/

  //maybe? https://www.jqueryscript.net/time-clock/Circular-Countdown-Clock-Plugin-For-jQuery-CircularCountDownJs.html

  //***Audio List: https://www.myinstants.com/media/sounds/
  //***Link Sprites: http://www.press-start.be/2012/09/the-legend-of-zelda-a-link-to-the-past/

  //buttons to change duration
  //session time

  $("#session-sub").click(function () {
    var timeStr = $("#session-time").html().split(":");
    if (Number(timeStr[0]) > 1) {
      timeStr[0] -= 1;
      timeStr = timeStr.join(":");
      $("#session-time").html(timeStr);
      $(".time").html(timeStr);
    }
  });
  $("#session-add").click(function () {
    var timeStr = $("#session-time").html().split(":");
    timeStr[0] = Number(timeStr[0]) + 1;
    timeStr = timeStr.join(":");
    $("#session-time").html(timeStr);
    $(".time").html(timeStr);
  });
  //short break
  $("#short-sub").click(function () {
    var timeStr = $("#short-time").html().split(":");
    if (Number(timeStr[0]) > 1) {
      timeStr[0] -= 1;
      timeStr = timeStr.join(":");
      $("#short-time").html(timeStr);
      $(".time").html(timeStr);
    }
  });
  $("#short-add").click(function () {
    var timeStr = $("#short-time").html().split(":");
    timeStr[0] = Number(timeStr[0]) + 1;
    timeStr = timeStr.join(":");
    $("#short-time").html(timeStr);
    $(".time").html(timeStr);
  });
  //long break
  $("#long-sub").click(function () {
    var timeStr = $("#long-time").html().split(":");
    if (Number(timeStr[0]) > 1) {
      timeStr[0] -= 1;
      timeStr = timeStr.join(":");
      $("#long-time").html(timeStr);
      $(".time").html(timeStr);
    }
  });
  $("#long-add").click(function () {
    var timeStr = $("#long-time").html().split(":");
    timeStr[0] = Number(timeStr[0]) + 1;
    timeStr = timeStr.join(":");
    $("#long-time").html(timeStr);
    $(".time").html(timeStr);
  });

  //Audio
  var audio = new Audio("https://www.myinstants.com/media/sounds/zeldasecret.swf.mp3");
  var intervalID;

  //desktop notifications
  function notify() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    } else {
      var noticeTitle = undefined,
          noticeMessage = undefined;
      if (pomodoros === 4) {
        noticeTitle = "Long Break!";
        noticeMessage = "Take a " + $("#long-time").html() + " break, and then back to work.";
      } else if (nextTimer === "Break") {
        noticeTitle = "Short Break!";
        noticeMessage = "Take a quick " + $("#short-time").html() + " break, and then back to work.";
      } else {
        noticeTitle = "Work Session!";
        noticeMessage = "You've got " + $("#session-time").html() + " to get some work done.";
      }
      var notification = new Notification(noticeTitle, {
        icon: 'https://bit.ly/2arlPFb',
        body: noticeMessage
      });

      setTimeout(function () {
        notification.close();
      }, 5000);
    }
  }

  //timer run function
  function intervalFunc() {
    return function () {
      if (intervalID) {
        clearInterval(intervalID);
        intervalID = false;
      } else {
        if (pomodoros === 1 && nextTimer === "Break") {
          $(".pomodoro-tracking").html('<img src="https://bit.ly/2a9ywWR">');
        }
        intervalID = setInterval(timerFunc, 1000);
      }
    };
  }

  var pomodoros = 1,
      nextTimer = "Break",
      curTimer = "Session",
      meterStr = $(".time").html().split(":"),
      meterTotal = Number(meterStr[0]) * 60 + Number(meterStr[1]);

  function timerFunc() {
    var timeStr = $(".time").html().split(":"),
        minutes = Number(timeStr[0]),
        seconds = Number(timeStr[1]);
    //total time for meter   

    if (minutes === 0 && seconds === 1) {
      audio.play();
      if (pomodoros === 4) {
        notify();
        $(".time").html($("#long-time").html());
        $(".timer-inner").css({ "background-color": "#6384aa" });
        $(".timer-outer").css({ "border": "10px solid #6384aa" });
        $(".meter span").css({ "background-color": "#6384aa" });
        $(".meter span").css({ "width": "100%" });
        pomodoros = 0;
        nextTimer = "Session";
        curTimer = "LongBreak";
        $(".pomodoro-tracking").html('<img class="sleep-sprite" src="https://bit.ly/2amOS9I">');
      } else if (nextTimer === "Break") {
        notify();
        $(".time").html($("#short-time").html());
        $(".timer-inner").css({ "background-color": "#aa6364" });
        $(".timer-outer").css({ "border": "10px solid #aa6364" });
        $(".meter span").css({ "background-color": "#aa6364" });
        $(".meter span").css({ "width": "100%" });
        nextTimer = "Session";
        curTimer = "Break";
        $(".pomodoro-tracking").html("");
        for (var i = 0; i < pomodoros; i++) {
          var pomCheck = $(".pomodoro-tracking").html();
          pomCheck = pomCheck + '<img src="https://bit.ly/2amN9B8">';
          $(".pomodoro-tracking").html(pomCheck);
        }
      } else if (nextTimer === "Session") {
        notify();
        $(".time").html($("#session-time").html());
        $(".timer-inner").css({ "background-color": "#66aa64" });
        $(".timer-outer").css({ "border": "10px solid #66aa64" });
        $(".meter span").css({ "background-color": "#66aa64" });
        $(".meter span").css({ "width": "100%" });
        nextTimer = "Break";
        curTimer = "Session";
        pomodoros += 1;
        $(".pomodoro-tracking").html("");
        for (var i = 0; i < pomodoros; i++) {
          var pomCheck = $(".pomodoro-tracking").html();
          pomCheck = pomCheck + '<img src="https://bit.ly/2a9ywWR">';
          $(".pomodoro-tracking").html(pomCheck);
        }
        //pomCheck = pomCheck + "<i class='fa fa-check'></i>";
      }
    } else {
        var totalTime = minutes * 60 + seconds;
        totalTime--;
        if (pomodoros === 4 || pomodoros === 0) {
          meterStr = $("#long-time").html().split(":");
          meterTotal = Number(meterStr[0]) * 60 + Number(meterStr[1]);
        } else if (curTimer === "Break") {
          meterStr = $("#short-time").html().split(":");
          meterTotal = Number(meterStr[0]) * 60 + Number(meterStr[1]);
        } else {
          meterStr = $("#session-time").html().split(":");
          meterTotal = Number(meterStr[0]) * 60 + Number(meterStr[1]);
        }
        var meterTime = totalTime / meterTotal * 100;
        $(".meter span").css({ "width": meterTime + "%" });
        minutes = Math.floor(totalTime / 60);
        seconds = totalTime - minutes * 60;
        if (seconds < 10) {
          seconds = seconds.toString();
          seconds = "0" + seconds;
        }
        timeStr[0] = minutes;
        timeStr[1] = seconds;
        timeStr = timeStr.join(":");
        $(".time").html(timeStr);
      }
  }

  //start timer button
  $(".timer-inner").click(intervalFunc());
});