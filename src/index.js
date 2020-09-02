const baseURL = "http://localhost:3000/quotes"
const quoteList = document.getElementById('quote-list')
const quoteForm = document.getElementById('new-quote-form')



function getQuotes(){
  fetch(baseURL+"?_embed=likes")
  .then(resp=>resp.json())
  .then(renderQuotes)
}

function renderQuotes(quotesArray){
  for(const quote of quotesArray){
    renderQuote(quote)
  }
}

function renderQuote(quoteObj){
  quoteList.insertAdjacentHTML('beforeend', `
    <li class='quote-card' data-quote-id="${quoteObj.id}">
      <blockquote class="blockquote">
        <p class="mb-0">${quoteObj.quote}</p>
        <footer class="blockquote-footer">${quoteObj.author}</footer>
        <br>
        <button data-quote-id="${quoteObj.id}" class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
        <button data-quote-id="${quoteObj.id}" class='btn-danger'>Delete</button>
      </blockquote>
    </li>
  `)
}

quoteForm.addEventListener('submit', e => {
  e.preventDefault()
  let newQuote = {quote: quoteForm.quote.value, author: quoteForm.author.value}
  createNewQuote(newQuote)
  quoteForm.reset()
})

function createNewQuote(quoteObj){
  const options = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, 
    body: JSON.stringify(quoteObj)
  }
  fetch(baseURL, options)
  .then(resp=>resp.json())
  .then(getQuotes())
}

quoteList.addEventListener('click', e => {
  if (e.target.matches('button.btn-danger')){
    deleteQuote(e.target.dataset.quoteId, e.target)
  } else if (e.target.matches('button.btn-success')){
    addLike(e.target.dataset.quoteId)
  }
})

function deleteQuote(quoteId, button){
  fetch(baseURL+`/${quoteId}`, {method: 'DELETE'})
  .then(resp=>resp.json())
  .then(removeQuoteFromDom(button))
}

function removeQuoteFromDom(buttonEle){
  buttonEle.parentNode.parentNode.remove()
}

function addLike(quoteId){
  const id = parseInt(quoteId, 10)
  const options = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, 
    body: JSON.stringify({quoteId: id})
  }
  fetch('http://localhost:3000/likes', options)
  .then(resp=>resp.json())
  .then(addLikeToDOM(quoteId))
}

function addLikeToDOM(quoteId){
  const found = document.querySelectorAll(`[data-quote-id="${quoteId}"]`)[1]
  let numLikes = parseInt(found.children[0].innerText, 10)
  numLikes += 1
  found.children[0].innerText = numLikes
}




getQuotes()



