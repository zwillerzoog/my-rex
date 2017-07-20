
//1 state
let state = {
  users: [],
  view: {
    login: true,
    mainList: false,
    ListResults: false,
    recs: false
  }
};

//2 function

function storeData(data) {
  state.users = data;
  render(state);
  console.log('state', state);
}

//3 render

const render = (state) => {
  let listResults = '';
  state.users.forEach(function (items) {
    listResults += (`
    `);
  });

};

//4 event listeners

$('#register-form').submit(function (e) {
  e.preventDefault();
  console.log('Hello');
  const url = 'http://localhost:8080/api/signup';
  const usernameInput = $('#username-input').val();
  console.log('username: ', usernameInput);
  $.ajax({
    url,
    method: 'POST',
    //dataType: "json",
    data: { username: usernameInput }
  })
    .done(data => {
      console.log(data);
    });
});

$('#query-form').submit(function (e) {
  e.preventDefault();
  console.log('Hello');
  const url = '/api/users/list/';
  const query = $('#query').val();
  console.log(query);
  $.ajax({
    url,
    method: 'POST',
    //dataType: "json",
    data: {
      name: query,
      username: 'abcd'
    }

  })
    .done(data => {
      console.log(data);

      let listArray =  `
        <p> ${data.Similar.Info[0].Name} </p>
        <button type="button" class="rec-button">Rex for ${data.Similar.Info[0].Name} </button>
        `;

      $('#list-results').append(listArray);
      console.log('state', state);
    });
});

function recHandler() {

  $('#list-results').on('click', '.rec-button', function () {

    //console.log(e.target);
    const url = '/api/recommendations/';
    const query = data.Similar.Results;
    $.ajax({
      url,
      method: 'POST',
      //dataType: "json",
      data: { query } 

    })
      .done(data => {
        console.log(data);

        let recArray = `<p> ${data.Similar.Results} </p>
        `;

        $('.recs').append(recArray);
        console.log('state', state);
      });
  });
}

$(function () {
  recHandler(state);
});





