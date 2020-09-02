
document.addEventListener("DOMContentLoaded", function(e){
    
    const baseURL = 'http://localhost:3000/quotes?_embed=likes'
    let quoteList = document.querySelector('#quote-list')
    
    const getQuotes = () => {
        fetch(baseURL)
        .then(resp => resp.json())
        .then(renderQuotes)
    }
    
    const renderQuotes = (quotes) =>{
        quoteList.innerHTML = ''
        for (const quote of quotes){
            renderQuote(quote)
        }

    }

    const renderQuote = (quoteObj) => {

        const {id, quote, author} = quoteObj
        fetch('http://localhost:3000/likes?quoteId='+id)
        .then(resp => resp.json())
        .then(likesArray => {
            quoteList.insertAdjacentHTML('beforeend',`   
            <li class='quote-card'>
                <blockquote class="blockquote">
                    <p class="mb-0">${quote}</p>
                    <footer class="blockquote-footer">${author}</footer>
                    <br>
                    <button data-id="${id}" class='btn-success'>Likes: <span>${likesArray.length}</span></button>
                    <button data-id="${id}" class='btn-danger'>Delete</button>
                    <button data-id="${id}" class='btn-edit'>Edit</button>
                </blockquote>
                <div data-id="${id}" class="form-container"></div>
            </li>
            `)
            }) 
        }

    

    const submitListener = () => {
        document.addEventListener('submit', function(e){
            e.preventDefault()
            if (e.target.matches('#new-quote-form')){
                let form = e.target
                let newQuote = document.querySelector('#new-quote').value
                let newAuthor = document.querySelector('#author').value
                // console.log({newQuote,newAuthor})
                    const options = {
                        method: "POST",
                        headers:{
                            "content-type": "application/json",
                            "accept": "application/json"
                        },
                        body: JSON.stringify({
                            quote: newQuote,
                            author: newAuthor
                        })
                    }

                    fetch(baseURL, options)
                    .then(resp => resp.json())
                    .then(data => {
                        quoteList.innerHTML = ''
                        getQuotes()
                    })
                }
            else if (e.target.matches('#edit-quote-form')){
                let form = e.target
                const edittedQuote = form.quote.value 
                const edittedAuthor = form.author.value
                const id = parseInt(form.parentNode.dataset.id)
                console.log({edittedAuthor, edittedQuote,id})

                options = {
                    method: "PATCH",
                    headers:{
                        'content-type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({
                        quote: edittedQuote,
                        author:edittedAuthor,
                    })
                }

                fetch('http://localhost:3000/quotes/'+id, options)
                .then(resp => resp.json())
                .then(data =>{
                    quoteList.innerHTML = ''
                    getQuotes()
                })
            }
        })
    }
 
    const eventListener = () => {
        document.addEventListener('click', function(e){
            if (e.target.matches('.btn-danger')){
                let deleteButton = e.target
                let quoteID = deleteButton.dataset.id
                    const options = {
                        method: "DELETE",
                        header:{
                            "content-type": "application/json",
                        },
                    }
                    fetch(baseURL+quoteID, options)
                    .then(resp => resp.json())
                    .then(data => {
                        quoteList.innerHTML = ''
                        getQuotes()
                    })
                }
            else if (e.target.matches('.btn-success')){
                let likeButton = e.target
                let quoteID = parseInt(likeButton.dataset.id,10)
                const options = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        'accept': "application/json"
                    },
                    body:JSON.stringify({
                        quoteId: quoteID
                    })
                }
                fetch('http://localhost:3000/likes', options)
                .then(resp => resp.json())
                .then(data => {
                    likeButton.children[0].innerText = parseInt(likeButton.children[0].innerText) +1
                })
            }
            else if (e.target.matches('.btn-edit')){
                if (e.target.innerText === "Edit"){
                    let formContainer = document.querySelector('.form-container')
                    console.log(formContainer)
                    formContainer.insertAdjacentHTML('beforeend',`
                    <form id="edit-quote-form">
                    <label for="edit-quote">Edit Quote</label>
                        <input name="quote" type="text" class="edit-quote" id="new-quote" placeholder="Update Quote">
                        <label for="Author">Author</label>
                        <input name="author" type="text" class="edit-author" id="author" placeholder="Update Author">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                    `)
                    e.target.innerText = "Hide"
                }
                else if (e.target.innerText === "Hide"){
                    let formContainer = document.querySelector('.form-container')
                    formContainer.innerText = ''
                    e.target.innerText = "Edit"
                }
            }
            else if (e.target.matches('.sort-bttn')){
                if (e.target.innerText === "Sort By Author"){
                    fetch(baseURL)
                    .then(resp => resp.json())
                    .then(data =>{
                        function compare(a, b) {
                            // Use toUpperCase() to ignore character casing
                            const author1 = a.author.toUpperCase();
                            const author2 = b.author.toUpperCase();
                            let comparison = 0;
                            if (author1 > author2) {
                                comparison = 1;
                            } else if (author1 < author2) {
                                comparison = -1;
                            } return comparison;
                        }
                        data.sort(compare)
                        quoteList.innerHTML = ''
                        renderQuotes(data)
                        e.target.innerText = "Sort by ID"
                    })
                }
                else if (e.target.innerText === "Sort by ID"){
                    quoteList.innerHTML = ''
                    getQuotes()
                    e.target.innerText = "Sort by Author"
                }
            }
        })
    }




    getQuotes()
    submitListener()
    eventListener()


})

