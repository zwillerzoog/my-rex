//1 state
let state = {
  myList: [],
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
}
//3 render
function render(state) {
  //const resultArray = state.view.ListResults.Similar.Results;
  //console.log('RESULTS ARRAY LENGTH: ', state.view.ListResults.Similar.Results.length);
  // let listResults = '';
  // state.users.forEach(function(items) {
  //   listResults += `
  //   `;
  //};
}
// BEST PRACTICE -- WORK ON LATER
// function showView(){
//     if (state.view = 'login') {
//       $('.login').removeAttr('hidden');
//       $('.main-list').attr('hidden', true);
//       $('.recs').attr('hidden', true);
//       console.log("STATE IS LOGIN");
//     } else if (state.view = 'main-list') {
//       $('.main-list').removeAttr('hidden');
//       $('.login').attr('hidden', true);
//       $('.recs').attr('hidden', true);
//     } else if (state.view = 'recs') {
//       $('.recs').removeAttr('hidden');
//       $('.login').attr('hidden', true);
//       $('.main-list').attr('hidden', true);
//     }
// }
// $('.login').hide()
// $('.main-list').hide()
// $('.recs').hide()
// $(`.${state.view}`).show();
//4 event listeners
function addUser() {
  $('#register-form').submit(function(e) {
    e.preventDefault();
    const url = '/api/signup';
    const username = $('#username-input').val();
    const password = $('#password-input').val();
    const email = $('#email-input').val();
    $.ajax({
      url,
      method: 'POST',
      //dataType: "json",
      data: { username, password, email }
    }).done(data => {
      state.users = data;
      $('.main-list').removeAttr('hidden');
      $('.login').attr('hidden', true);
      $('.recs').attr('hidden', true);
    });
  });
}

$('#query-form').submit(function(e) {
  e.preventDefault();
  const url = '/api/users/list/';
  let query = $('#query').val();
  $.ajax({
    url,
    method: 'POST',
    //dataType: "json",
    data: {
      name: query
    }
  }).done(data => {
    state.myList.push(data);
    for (var i = 0; i < data.Similar.Info.length; i++) {
      if (
        state.myList !== undefined &&
        state.myList[i].Similar.Results.length === 0
      ) {
        $('.correction').removeAttr('hidden');
        query = $('#query').val('');
      } else {
        let listArray = `<p> ${data.Similar.Info[0].Name} </p>
          <button type="button" class="rec-button">Rex for ${data.Similar.Info[0].Name} </button>`;
        $('.correction').attr('hidden', true);
        $('#list-results').append(listArray);
        query = $('#query').val('');
      }
    }
  });
});

function recHandler() {
  $('#list-results').on('click', '.rec-button', function(e) {
    const query = e.target.textContent;
    // shouldn't this use an ID to get an exact rec?
    // how can we store the rec ID in the DOM on render
    // to easily pass to this function?

    const url = '/api/recommendations/';

    $.ajax({
      url,
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      data: { q: query }
    }).done(() => {
      const resultsList = state.myList;
      $('.recs').html(
        `<h2 class="recs-title">My Rex for ${state.myList[0].Similar.Info[0]
          .Name}</h2>
        <button id="back">Go back to Your List</button>`
      );

  
      let recArray = `<p class="resName">${name}</p>
      <p class="resType">${type}</p>`;
      $('.recs').append(recArray);
      $('.recs').removeAttr('hidden');
      $('.login').attr('hidden', true);
      $('.main-list').attr('hidden', true);
    });
  });
}
function backClickHandler() {
  $('.recs').on('click', '#back', function() {
    $('.main-list').removeAttr('hidden');
    $('.login').attr('hidden', true);
    $('.recs').attr('hidden', true);
  });
}
$(function() {
  recHandler(state);
  backClickHandler();
  render(state);
  addUser();
});
