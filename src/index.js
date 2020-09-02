const baseURL = 'http://localhost:3000/quotes/'
const likeURL = 'http://localhost:3000/likes'
const ce = element => document.createElement(element)
const qs = selector => document.querySelector(selector)
const gid = id => document.getElementById(id)

const newQuoteForm = gid('new-quote-form')
const quoteListUl = gid('quote-list')


function getQuotes() {
    fetch(baseURL + '?_embed=likes')
    .then(resp => resp.json())
    .then(quotes => displayQuotes(quotes))
}

function displayQuotes(quotes) {
    quoteListUl.innerHTML = ""
    for (const quote of quotes) {
        displayQuote(quote)
    }
}

function displayQuote(quote) {
    let quoteCard = ce('li')
        quoteCard.classList.add('quote-card')
        quoteCard.dataset.quoteId = quote.id
    let likes = quote.likes ? quote.likes.length : "0"
    let blockquote = ce('blockquote')
        blockquote.classList.add('blockquote')
        blockquote.innerHTML = `
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${likes}</span></button>
            <button class='btn-danger'>Delete</button>`
    quoteCard.append(blockquote)
    quoteListUl.append(quoteCard)
}

newQuoteForm.addEventListener('submit', e => {
    e.preventDefault()
    let config = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accepts": "application/json"
        },
        body: JSON.stringify({
            quote: newQuoteForm.quote.value,
            author: newQuoteForm.author.value
        })
    }
    fetch(baseURL, config)
    .then(resp => resp.json())
    .then(quote => displayQuote(quote))
})

quoteListUl.addEventListener('click', e => {
    if (e.target.matches('.btn-success')) {
        let quoteId = parseInt(e.target.parentElement.parentElement.dataset.quoteId)
        let config = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify({
                quoteId: quoteId
            })
        }
        fetch(likeURL, config)
        .then(resp => resp.json())
        .then(getQuotes())
    } else if (e.target.matches('.btn-danger')) {
        let quoteId = parseInt(e.target.parentElement.parentElement.dataset.quoteId)
        fetch(baseURL + quoteId, {method: "DELETE"})
        .then(resp => resp.json())
        .then(getQuotes())
    }
})





getQuotes()