url='http://localhost:3000/quotes?_embed=likes'

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    get()
    postMan()
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
    <footcer class="blockquote-footer">${quote.quote}</footcer>
    <br>
    <button class='btn-success' data-id='${quote.id}'>Likes: <span>0</span></button>
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
        debugger
    })//end of add eventLister of postMan
}//end of postMat