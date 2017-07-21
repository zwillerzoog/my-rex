//1 state
let state = {
  users: [],
  view: {
    login: true,
    mainList: false,
    ListResults: false,
    recs: false,
  },
};

//2 function

function storeData(data) {
  state.users = data;
  render(state);
  console.log('state', state);
}

//3 render

function render(state) {
  console.log(state);
  //const resultArray = state.view.ListResults.Similar.Results;
  //console.log('RESULTS ARRAY LENGTH: ', state.view.ListResults.Similar.Results.length);
  // let listResults = '';
  // state.users.forEach(function(items) {
  //   listResults += `
  //   `;
  //};
};

//4 event listeners

function addUser() {
$('#register-form').submit(function(e) {
  e.preventDefault();
  console.log('Hello');
  const url = 'http://localhost:8080/api/signup';
  const username = $('#username-input').val();
  const password = $('#password-input').val();
  const email =$('#email-input').val();
  $.ajax({
    url,
    method: 'POST',
    //dataType: "json",
    data: { username, password, email },
  }).done(data => {
    state.users = data;
    //console.log(state);
  });
});
}


$('#query-form').submit(function(e) {
  e.preventDefault();
  //console.log('Hello');
  const url = '/api/users/list/';
  const query = $('#query').val();
  //console.log(query);
  $.ajax({
    url,
    method: 'POST',
    //dataType: "json",
    data: {
      name: query,
      username: 'abcd',
    },
  }).done(data => {
   // console.log(data);
    state.view.ListResults = data;

    if (state.view.ListResults !== false && state.view.ListResults.Similar.Results.length === 0) {
      console.log('i think something\'s happening')
       $('.correction').removeAttr('hidden');
    } else {
    let listArray = 
        `<p> ${data.Similar.Info[0].Name} </p>
        <button type="button" class="rec-button">Rex for ${data.Similar.Info[0]
          .Name} </button>`;
    
    $('.correction').attr('hidden', true)
    $('#list-results').append(listArray);
    console.log('state', state);
    }
  });
});

function populateRecs() {
  
  
}

function recHandler() {
  $('#list-results').on('click', '.rec-button', function() {
    //console.log(e.target);
    const url = '/api/recommendations/';
    const query = state.view.ListResults.Similar.Results;
    console.log('QUERYYYYY', query);
    $.ajax({
      url,
      method: 'POST',
      //dataType: "json",
      data: { query },
    }).done(data => {
      const results = state.view.ListResults.Similar.Results;
      console.log(state.view.ListResults.Similar.Results[0].Name);
      console.log(typeof type);
      $('.recs').html(`<h2>My-Rex for ${state.view.ListResults.Similar.Info[0].Name}</h2>`);
      console.log('RESULTS ARRAY FROM RECHANDLER: ', state.view.ListResults.Similar.Results);
      for (let i=1; i < results.length; i++) {
        const name = results[i].Name;
        const type = results[i].Type;
        let recArray = `<p>${name}</p>
                      <p>${type}</p>`;
        $('.recs').append(recArray);
      //console.log('state', state);
    }
    });
  });
}

$(function() {
  recHandler(state);
  render(state);
});
