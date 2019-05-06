let dataset;

$(document).ready( function() {
  $('#load').click( function() {
    let data = "train=1";

    $.post('/load', data, function(e) {
      if(e == 'err') {
        console.error("error");
      } else {
        dataset = e;
        dataset = JSON.parse(dataset);
        console.log(dataset);


        alert('dataset loaded!');
      }
    })
  });

  $('#train').click( function() {
    let data = "train=1";

    $.post('/train', data, function(e) {
      if(e == 'err') {
        console.error("error");
      } else {
        console.log("success");
      }
    })
  });

  let dataArr = [];

  var socket = io.connect('http://localhost:8080');

  socket.on('getLose', function(data) {
    dataArr.push(data);
  });

  socket.on('complete', function(data) {
    console.log("Training complete");
  });



});
