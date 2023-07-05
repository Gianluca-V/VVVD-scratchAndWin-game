//let canvas = document.getElementById("canvas")

//canvas.style.backgroundColor = "red"


let ticketNumbers = Array.from(document.getElementsByClassName ("ticket-number"))
    ticketNumbers.forEach(element => {
        element.textContent = Math.floor(Math.random()*4)
    });


/*Todos los comentarios mulilineas tienen que estar cerrados o terminados pq sino da error y no funciona*/