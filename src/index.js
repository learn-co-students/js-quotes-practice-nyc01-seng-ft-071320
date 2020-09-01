const ce = tag => document.createElement(tag)
const qs = selector => document.querySelector(selector)
const quoteList = qs('#quote-list')
const sortBtn = ce('button')
qs('body').children[1].prepend(sortBtn)
sortBtn.textContent = 'sorted by id'
sortBtn.className = 'btn-info'
sortBtn.dataset.status = 'off'

const listQuote = (quote) => {
  const li = ce('li')
  quoteList.append(li)
  li.dataset.quoteId = quote.id
  li.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes? quote.likes.length : 0}</span></button>
    <button class='btn-secondary'>Edit</button>
    <button class='btn-danger'>Delete</button>
    </blockquote>
    <form class="edit-quote-form">
      <div class="form-group">
        <label for="edit-quote">Quote</label>
        <input name="quote" type="text" class="form-control" id="edit-quote">
      </div>
      <div class="form-group">
        <label for="Author">Author</label>
        <input name="author" type="text" class="form-control" id="author">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  `
  document.querySelectorAll('.edit-quote-form').forEach(form => form.style.display = 'none')
}

const getQuotes = () => {
  fetch('http://localhost:3000/quotes?_embed=likes')
  .then(res => res.json())
  .then(quotes => quotes.forEach(listQuote))
  // .then(quote => quote.sort(quote.author).forEach(listQuote))
  // .then(quote => console.log(quote.sort(quote.author)))
}

const submitHandler = () => {
  document.addEventListener('submit', e => {
    e.preventDefault()
    switch (true) {
      case e.target.id === 'new-quote-form':    
        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/json', 
            'accept': 'application/json'
          },
          body: JSON.stringify({
            quote: e.target.quote.value,
            author: e.target.author.value
          })
        }
        fetch('http://localhost:3000/quotes', options)
        .then(res => res.json())
        .then(listQuote)
        break
      case e.target.className === 'edit-quote-form':
        editQuote(e.target)
        break
    }
  })
}

const clickHandler = () => {
  document.addEventListener('click', e => {
    switch (e.target.className) {
      case 'btn-danger':
        deleteQuote(e.target)
        break
      case 'btn-success':
        likeQuote(e.target)
        break
      case 'btn-secondary':
        toggleEditForm(e.target)
        break
      case 'btn-info':
        sortList(e.target)
        break
      default:
        break
    }
  })
}

const deleteQuote = (target) => {
  const quoteLi = target.parentElement.parentElement

  const options = {
    method: 'DELETE', 
    headers: { 'content-type': 'application/json'}
  }
  fetch(`http://localhost:3000/quotes/${quoteLi.dataset.quoteId}`, options)
  .then(res => res.json())
  .then(quoteLi.remove())
}

const likeQuote = (target) => {
  const quote_id = parseInt(target.parentElement.parentElement.dataset.quoteId)

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json', 
      'accept': 'application/json'
    },
    body: JSON.stringify({
      quoteId: quote_id,
      createdAt: Date.now()
    })
  }
  fetch('http://localhost:3000/likes', options)
  target.children[0].textContent = parseInt(target.children[0].textContent) + 1
}

const toggleEditForm = (target) => {
  const form = target.parentElement.parentElement.lastElementChild
  form.style.display = form.style.display === 'none' ? '' : 'none'
}

const editQuote = (target) => {
  const quote_id = target.parentElement.dataset.quoteId
  const options = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json', 
      'accept': 'application/json'
    },
    body: JSON.stringify({
      quote: target.quote.value,
      author: target.author.value
    })
  }

  fetch(`http://localhost:3000/quotes/${quote_id}`, options)
  .then(res => res.json())
  .then(listQuote)
}

const sortList = (target) => {
  if (target.dataset.status === 'off') {
    target.dataset.status = 'on'
    target.textContent = 'sorted by author'
  } else {
    target.dataset.status = 'off'
    target.textContent = 'sorted by id'
  }
}

getQuotes()
submitHandler()
clickHandler()
