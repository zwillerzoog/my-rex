

const url = 'http://localhost:8080/api';




$(function() {

  $('#register-form').submit(function(e){
    e.preventDefault();
    console.log('Hello');
    const url = 'http://localhost:8080/api/signup';
    const usernameInput = $('#username-input').val();
    console.log("username: ", usernameInput);
    $.ajax({
      url,
      method: 'POST',
      //dataType: "json",
      data: {usernameInput}
    })
      .done(data => {
        console.log(data);
      });
  });
    $('#query-form').submit(function(e){
    e.preventDefault();
    console.log('Hello');
    const url = 'http://localhost:8080/api/:id';
    const query = $('#query').val();
    console.log("query: ", query);
    $.ajax({
      url, 
      method: 'PUT',
      //dataType: "json",
      data: {query}
    })
      .done(data => {
        console.log(data);
      });
  });
});
