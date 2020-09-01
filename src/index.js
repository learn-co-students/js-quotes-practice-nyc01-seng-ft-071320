url='http://localhost:3000/quotes?_embed=likes'

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    get()
    postMan()
    clunker()
});

function get(){
    fetch(url)
    .then(res=>res.json())
    .then(string=>string.forEach(quote=>render(quote)))
}

function render(quote){
    const ul = document.querySelector('#quote-list')
    const li = document.createElement('li')
    ul.appendChild(li)
    li.className='quote-card'
    li.dataset.id=quote.id
    li.innerHTML=`
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footcer class="blockquote-footer">${quote.author}</footcer>
    <br>
    <button class='btn-success' data-id='${quote.id}'>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger'data-id='${quote.id}'>Delete</button>
    </blockquote>`
    // let btns = document.querySelectorAll('button')
    // btns.forEach(btn=>{
    //     if (btn.className != "btn btn-primary"){btn.dataset.id=}
    // })
}//end of render

function postMan(){
    const form = document.querySelector('form')
    form.addEventListener('submit',(e)=>{
        e.preventDefault()
        console.log('You are clicking on the form button')
        const quote = form.quote.value
        const author = form.author.value
        faker = {
            "quote": form.quote.value,
            "author": form.author.value,
            "likes": []
        }
        fetch(`http://localhost:3000/quotes?_embed=likes`, {
            method: "POST",
            headers: {
            "Content-type": "application/json",
            "accept": "application/json"
            },
            body: JSON.stringify(
                faker
            ) //single vars object has brackets vs the entire object, which is bare
        })// This is the end of my fetch
        .then(res=>res.json())
        .then(render)
    })//end of add eventLister of postMan
}//end of postMat

function clunker(){
    document.addEventListener('click',(e)=>{//console.log("inside")
        if(e.target.matches('.btn-danger')){//console.log("we inside danger")//console.log(e.target.dataset.id)
            const id = e.target.dataset.id
            const item = e.target.closest('.quote-card')
            fetch(`http://localhost:3000/quotes/${id}`, {
            method: "DELETE"
            }).then(res=>res.json())
            item.parentNode.removeChild(item)
        }//This is the end of my delete matches
        if(e.target.matches('.btn-success')){//console.log("this is likes")
            const myId = Date.now()
            const quoteId = parseInt(e.target.dataset.id)
            const span = e.target.querySelector('span')
            const number= parseInt(span.innerText)+1
            console.log(number)
            obj={
                "id": myId,
                "quoteId": quoteId,
                "createdAt": (Date.now())
            }
            console.log(obj)
            fetch(`http://localhost:3000/likes`, {
                method: "POST",
                headers: {
                "Content-type": "application/json",
                "accept": "application/json"
                },
                body: JSON.stringify(
                    obj
                ) //single vars object has brackets vs the entire object, which is bare
            })// This is the end of my fetch
            .then(res=>res.json()).then(result=>{
                //console.log(result.quoteId)
                //console.log(quoteId)
                if (quoteId==result.quoteId){span.innerText=number}
                //console.log(result)
                })
            
        }
    })//This is the end of Event List in clunk
}//This is the end of clunk