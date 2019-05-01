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
});
