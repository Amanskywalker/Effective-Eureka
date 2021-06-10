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

// search function
var search =  async function(event) {
    // prevent form default action
    event.preventDefault();

    let response = await fetch('/api/v1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      params : {
        'q' : document.getElementById("q").value
      }
    });
    let search_result = await response.json();

    console.log(search_result)

    let html='';

    for( let i=0; i<search_result.items.length; i++){
        html += result_card_html(search_result.items[i]);
    }

    document.getElementById("result_cards").innerHTML=html;
};

// form
var form = document.getElementById("search_form");

// attach event listener
form.addEventListener("submit", search, true);
