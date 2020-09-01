document.addEventListener("DOMContentLoaded", () => {
    const url = "http://localhost:3000/quotes?_embed=likes"
    const baseUrl = "http://localhost:3000/quotes/"
    const likeUrl = "http://localhost:3000/likes"
    const quoteList = document.querySelector("#quote-list")
    const form = document.querySelector("form")
    let quoteCount = 0
    function getJson() {
        fetch(url)
        .then(response => response.json())
        .then(data => parseData(data))
    }

    function parseData(data) {
        for(let quoteObj of data){
            quoteCount++
            createQuote(quoteObj.quote, quoteObj.author)
        }
    }

    function createQuote(quote, author) {
        let quoteLi = document.createElement("li")
        quoteLi.id = quoteCount + 1
        quoteLi.className = "quote-card"
        let blockquote = document.createElement("blockquote")
        blockquote.className = "blockquote"
        blockquote.innerHTML = `
        <p class=mb-0>${quote}</p>
        <footer class="blockquote-footer">${author}</footer>
        <br>
        <button class="btn-success">Likes: <span>0</span></button>
        <button class="btn-danger"></button>
        `
        quoteLi.append(blockquote)
        quoteList.append(quoteLi)
    }

    function submitHandler(){
        document.addEventListener("submit", e => {
            debugger
            e.preventDefault()
            const form = e.target
            console.log("Inside event listener")
            const quote = form.quote.value
            const author = form.author.value
            // form.reset()
            sendCreateReq(quote, author)
        })
    }

    function sendCreateReq(quote, author) {
        const quoteObject = {
            quote: quote, 
            author: author
        }            
        
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(quoteObject)
        }
        
        fetch(baseUrl, options)
        .then(res => res.json())
        .then(createQuote)
    }
    
    
    function clickHandler(){
        document.addEventListener("click", e => {
            e.preventDefault()
            button = e.target
            if(button.matches(".btn-danger")){
                sendDeleteReq()
            }
            else if(button.matches(".btn-success")){
                increamentLikes()
            }
        })
    }

    function sendDeleteReq(){
        const option = {
            method: "DELETE"
        }
        let selectedId = button.parentElement.parentElement.id
        fetch(baseUrl + selectedId, option)
        .then(obj => {
            button.parentElement.parentElement.remove()
        })
    }

    function increamentLikes(){
        let likes = button.innerText
        let num = likes.replace("Likes: ", "")
        let likeCount = parseInt(num, 10)
        likeCount++

        let quoteIdStr = button.parentElement.parentElement.id
        let quoteIdNum = parseInt(quoteIdStr)
        button.innerText = `Likes: ${likeCount}`

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        body: JSON.stringify({ quoteId: quoteIdNum, createdAt: Date.now() })
        }
        fetch(likeUrl, options)
        .then(resp => resp.json())
        .then(success => console.log("Hooray!"))
    }


    
getJson()
clickHandler()
submitHandler()
})