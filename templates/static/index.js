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

function new_page_url(page){
  var searchParams = new URLSearchParams(window.location.search);
  searchParams.set('page',page)
  var newParams = searchParams.toString()
  return newParams;
}

function result_pagination_html(obj) {
    if(typeof(obj)!== 'object') return '';

    number_of_pages = Math.ceil((Number(obj['total']) / Number(obj['page_size'])))



    let html = `
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-end">
        `
        // make previous arrow
        if (obj['page'] > 1){
          html = html + `
            <li class="page-item">
              <a class="page-link" href="/?`+new_page_url(Number(obj['page'])-1)+`" id="previous_arrow">Previous</a>
            </li>
          `
        }else{
          html = html + `
            <li class="page-item disabled">
              <a class="page-link" href="#" aria-disabled="true" id="previous_arrow">Previous</a>
            </li>
          `
        }
        if (obj['page'] > 4){
          html = html + `
            <li class="page-item">...</li>`
        }
        if (obj['page'] > 3){
          html = html + `
            <li class="page-item"><a class="page-link" href="/?`+new_page_url(Number(obj['page'])-3)+`">${obj['page']-3}</a></li>
            `
        }
        if (obj['page'] > 2){
          html = html + `
            <li class="page-item"><a class="page-link" href="/?`+new_page_url(Number(obj['page'])-2)+`">${obj['page']-2}</a></li>
            `
        }
        if (obj['page'] > 1){
          html = html + `
            <li class="page-item"><a class="page-link" href="/?`+new_page_url(Number(obj['page'])-1)+`">${obj['page']-1}</a></li>
            `
        }
        html = html + `
          <li class="page-item active" aria-current="page">
            <a class="page-link" href="/?`+new_page_url(Number(obj['page']))+`">${obj['page']}</a>
          </li>
        `
        if (obj['page']+1 < number_of_pages){
          html = html + `
            <li class="page-item"><a class="page-link" href="/?`+new_page_url(Number(obj['page'])+1)+`">${obj['page']+1}</a></li>
            `
        }
        if (obj['page']+2 < number_of_pages){
          html = html + `
            <li class="page-item"><a class="page-link" href="/?`+new_page_url(Number(obj['page'])+2)+`">${obj['page']+2}</a></li>
            `
        }
        if (obj['page']+3 < number_of_pages){
          html = html + `
            <li class="page-item"><a class="page-link" href="/?`+new_page_url(Number(obj['page'])+3)+`">${obj['page']+3}</a></li>
            `
        }
        if (obj['page']+4 < number_of_pages){
          html = html + `
            <li class="page-item">...</li>
            `
        }
        // make next arrow
        if (obj['has_more'] == true){
          html = html + `
            <li class="page-item">
              <a class="page-link" href="/?`+new_page_url(Number(obj['page'])+1)+`" id="next_arrow">Next</a>
            </li>
          `
        }else{
          html = html + `
            <li class="page-item disabled">
              <a class="page-link" href="#" id="next_arrow" aria-disabled="true">Next</a>
            </li>
          `
        }

        html = html + `
      </ul>
    </nav>
    `;

    document.getElementById("pagination").innerHTML=html;
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
    var landing = document.getElementById("landing");
    landing.value = false ;
    return true;
};

// form
var form = document.getElementById("search_form");

// attach event listener
form.addEventListener("submit", search, true);

async function doSearch() {
  if(document.getElementById("landing").value == 'false'){
    search_result = await execute_search();
    console.log(search_result);
    mount_result(search_result);
    result_pagination_html(search_result);
  }
}
window.onload = doSearch();
