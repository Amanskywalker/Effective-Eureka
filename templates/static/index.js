function result_card_html(obj) {
    if(typeof(obj)!== 'object') return '';

    let html = `
    <div class="card" id="${obj['title']}">
      <div class="card-body">
        <h5 class="card-title">${obj['title']}</h5>
        <p class="card-text">${obj['body']}</p>
        <a href="${obj['link']}" class="card-link">Open</a>
      </div>
    </div>
    <br/>
    `;

    return html;
}

async function mount_result(search_result){
  // generate the result cards and put it in html body
  let html='';

  for( let i=0; i<search_result.items.length; i++){
      html += result_card_html(search_result.items[i]);
  }

  document.getElementById("result_cards").innerHTML=html;
}

async function execute_search(){
  // take the params and execute the search
  let response = await fetch('/api/v1?'+ new URLSearchParams(
      {
        'q'         : document.getElementById("q").value,
        'page'      : document.getElementById("page").value,
        'pagesize'  : document.getElementById("pagesize").value,
        'answers'   : document.getElementById("answers").value,
        'body'      : document.getElementById("body").value,
        'tagged'    : document.getElementById("tagged").value,
        'title'     : document.getElementById("title").value,
        'views'     : document.getElementById("views").value,
      }
    ),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
  });

  if (response.status == 429){
    alert('Rate Limit exceded')
    return
  }

  let search_result = await response.json();

  return search_result;
}

// search function
var search =  async function(event) {
    // prevent form default action
    event.preventDefault();

    search_result = await execute_search();
    console.log(search_result);
    mount_result(search_result);
};

// form
var form = document.getElementById("search_form");

// attach event listener
form.addEventListener("submit", search, true);
