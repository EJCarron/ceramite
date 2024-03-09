function lock_screen_functionality(){
    document.addEventListener("click", e => {
        if (freezeClic) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);
}

function lock_screen(extra_function){
    extra_function()
    freezeClic = true;
}

function unlock_screen(extra_function){
    freezeClic = false;
    extra_function()
}

module.exports = {lock_screen_functionality,lock_screen,unlock_screen}