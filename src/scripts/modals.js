function close_modal(){
    var modal = document.getElementById("modal")
    modal.style.display = "none"
}

function show_modal(message, onclick_function){
    var modal = document.getElementById("modal")
    var modal_btn = document.getElementById("modal_btn")
    var modal_message = document.getElementById("modal_message")

    modal_btn.style.display = ''
    modal_btn.onclick = onclick_function

    modal_message.innerText = message

    modal.style.display = "block"
}

function screen_locked_modal(){
    var modal = document.getElementById("modal")
    var modal_btn = document.getElementById("modal_btn")
    var modal_message = document.getElementById("modal_message")


    modal_btn.style.display = 'none'

    modal_message.innerText = 'LOADING'

    modal.style.display = "block"
}


function error_modal(){
    show_modal('FAIL', close_modal)
}

module.exports = {show_modal, close_modal, error_modal, screen_locked_modal}