const baseURL = 'http://localhost:3000/'
const quoteContainer = document.querySelector('#quote-list')
const form = document.querySelector('#new-quote-form')

function getQuotes(){
    fetch(baseURL + 'quotes?_embed=likes')
    .then(resp => resp.json())
    .then(renderQuotes)
}

function renderQuotes(quoteArray){
    for(let quote of quoteArray){
        renderQuote(quote)
    }
}

function renderQuote(quote){
    const li = document.createElement('li')
    li.dataset.id = quote.id
    li.innerHTML =`<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
  </blockquote>`
  quoteContainer.append(li)
}


form.addEventListener('submit', function(e){
    e.preventDefault();
    let quote = form[0].value
    let author = form[1].value
    addQuote(quote, author) 
    form.reset();    
})

function addQuote(quote, author){

    config = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            quote: quote,
            author: author
        })
    }
    fetch(baseURL + 'quotes', config)
    .then(resp => {console.log(resp)
        if(resp.ok == true){
            quoteContainer.innerHTML = ""
            getQuotes();
        }
    })

}

quoteContainer.addEventListener('click', function(e){
    let id = e.target.parentElement.parentElement.dataset.id;
    if(e.target.matches('.btn-danger')){
        deleteQuote(id)      
    } else if (e.target.matches('.btn-success')){
        let likes = parseInt(e.target.firstElementChild.innerText)
        updatedLikes =likes + 1;
        console.log(id)
        updateLike(id)
        e.target.firstElementChild.textContent = updatedLikes
    }
})

function updateLike(id){
    let qID = parseInt(id)
    config = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            quoteId: qID
        })
    }
    fetch(baseURL+'likes', config)
    .then(resp => resp.json())
    .then(console.log)
}

function deleteQuote(id){
    let success = false
    config = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        }
    }
    fetch(baseURL + 'quotes/'+ id, config)
    .then(resp => {if(resp.ok == true){
        quoteContainer.innerHTML = ""
        getQuotes();
    }})
}
    


getQuotes();