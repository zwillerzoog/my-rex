
const url = 'http://localhost:8080/api';




$(function() {
  $('#query-form').submit(function (e) {
    e.preventDefault();
    console.log('Hello');
    const query = $('#query').val();
    console.log(query);
    $.ajax({
      url,
      method: 'POST',
      //dataType: "json",
      data: { query }
    })
      .done(data => {
        console.log(data);
      });
  });
});
