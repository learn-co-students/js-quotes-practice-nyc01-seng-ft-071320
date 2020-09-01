// Step 1 √
// Make a get request using fetch to grab all the quotes using http://localhost:3000/quotes?_embed=likes √
// Then add them to the UL quote-list √

// Step 2
// We need to add a submit listener for the form √ 
// We need to grab the input and create a new quote with it through a post request √
// We need to display it √

// Step 3
// Add a click listener √
// Send a delete request with fetch √
// Take the response and remove from DOM √

// Step 4
// Create event listner for like button
// Send a POST request to make a new like
// Update the DOM to reflect the number of likes



const baseURL = 'http://localhost:3000/quotes/'
const quoteURL = 'http://localhost:3000/quotes?_embed=likes'

const quoteList = document.querySelector('ul#quote-list')
const quoteForm = document.querySelector("form#new-quote-form")



let quotes = [];

function getQuotes() {
    fetch(quoteURL)
    .then(response => response.json())
    .then(allQuotes => {
        console.dir(allQuotes)
        renderQuotes(allQuotes)
        quotes = allQuotes
    })
}


function renderQuotes(quotes) {
    for (const quote of quotes) {
        quoteList.insertAdjacentHTML('beforeend', `
        <li class='quote-card' data-quote-id="${quote.id}">
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success' data-quote-id="${quote.id}">Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger' data-quote-id="${quote.id}">Delete</button>
            </blockquote>
        </li>`)
    }
}

function submitHandler() {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault()
        let quote = {
            'quote': quoteForm.quote.value,
            'author': quoteForm.author.value
        }
        postQuote(quote)
    })
}


function postQuote(quote) {

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(quote)
    }

    fetch(baseURL, options)
    .then(response => response.json())
    .then(renderQuote)
}

function renderQuote(quote) {
    quoteList.insertAdjacentHTML('afterbegin', `
    <li class='quote-card' data-quote-id="${quote.id}">
        <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success' data-quote-id="${quote.id}">Likes: <span>0</span></button>
            <button class='btn-danger' data-quote-id="${quote.id}">Delete</button>
        </blockquote>
    </li>`)  
}

function clickHandler() {
    document.addEventListener('click', function(e) {
        if(e.target.matches('button.btn-danger')){
            let quoteId = e.target.dataset.quoteId
            const response = deleteQuote(quoteId)
            e.target.parentElement.parentElement.remove();
        } else if (e.target.matches('button.btn-success')){
            addLikeToQuote(e.target.dataset.quoteId)
        }
    })
}

function deleteQuote(quoteId) {
    return fetch(baseURL + quoteId, {method: 'DELETE'})
    .then(response => response.json())
    }

function addLikeToQuote(id){
    const idInteger = parseInt(id, 10)
    const options = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
            Accept: "application/json"
        }, 
        body: JSON.stringify({quoteId: idInteger})
    }
    
    return fetch('http://localhost:3000/likes', options)
    .then(resp=>resp.json())
    .then(result => {
        addLikeToDom(id)
    })
}

function addLikeToDom(quoteId){
    const likeNum = document.querySelector(`[data-quote-id="${quoteId}"]`)
    const span = likeNum.childNodes[1].
    childNodes[7].childNodes[1]
    let numberOfLikes = parseInt(span.innerText, 10)
    numberOfLikes += 1
    span.innerText = numberOfLikes
}




getQuotes();
submitHandler();
clickHandler();