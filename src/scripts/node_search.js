const mithril_request = require("../scripts/mithril_request");
const local_data = require("../scripts/local_data")
const modals = require("../scripts/modals")
const lock = require("../scripts/lock_screen")



lock.lock_screen_functionality()

let freezeClic = false;

function fail_handler(){
    lock.unlock_screen(modals.close_modal)
    modals.error_modal()
}


var node_type_selecter = document.getElementById("node_type_selecter")

const node_types = local_data.node_types_list()

function append_option(val){
    var option = document.createElement("option")
    option.value = val
    option.innerText = val
    node_type_selecter.appendChild(option)
}

for (const higher_level_type of ['Electoral Commission All', 'Companies House All', 'Offshore Leaks All']){
    append_option(higher_level_type)
}

for (const node_type of node_types){
    append_option(node_type)
}

function search_btn_onclick(page_number){

    lock.lock_screen(modals.screen_locked_modal)

    const selecter = document.getElementById("node_type_selecter")
    selecter.disabled = true;

    var search_input = document.getElementById('search_input')
    search_input.disabled = true;

    const selected_type = selecter.value
    const query = search_input.value

    if (query == ""){
        return
    }
    
    var request_body = {
        'query': query,
        'page_number': page_number,
        'search_type': selected_type
    }

    var page_counter = document.getElementById('page_counter')
    page_counter.style.visibility = 'visible'
    page_counter.innerText = page_number

    var search_type_banner = document.getElementById('search_type_banner')
    search_type_banner.style.visibility = 'visible'
    search_type_banner.innerText = selected_type

    mithril_request.send_mithril_request(request_body=request_body, function_name="node_search", display_results, fail_handler)

}


function display_results(data){

    lock.unlock_screen(modals.close_modal)

    var results_container_div = document.getElementById('results_container_div')

    results_container_div.innerHTML = '';


    var node_dictionary = local_data.get_node_dictionary();


    for (let i = 0; i < data.length; i++){
        var result = data[i]

        results_container_div.appendChild(create_result_div(result, result_in_dictionary(node_dictionary, result)))

    }


}


function create_result_div(result, node_in_dictionary){
    var result_div = document.createElement('div')
    result_div.classList.add('card')
    
    var container_div = document.createElement('div')
    container_div.classList.add('container')

    var title = document.createElement('h1')
    title.innerText = result['title']
    container_div.appendChild(title)

    var description = document.createElement('h2')
    description.innerText = result['display_description']
    container_div.appendChild(description)

    if (node_in_dictionary){
        container_div.classList.toggle("clicked")
    }else{

        var add_to_dictionary_btn = document.createElement('button')
        add_to_dictionary_btn.innerText =  'add';
        add_to_dictionary_btn.addEventListener('click', function(){
            add_result_to_dictionary(result, container_div, add_to_dictionary_btn)
        });
        container_div.appendChild(add_to_dictionary_btn)
    }
    
    var show_description_btn = document.createElement('button')
    show_description_btn.innerText = 'show'
    show_description_btn.addEventListener('click', function(){
        modals.show_modal(result['full_description'], modals.close_modal)
    })
    container_div.appendChild(show_description_btn)


    result_div.appendChild(container_div)


    return result_div

}

function add_result_to_dictionary(result, div, button){
    
    var node_contents = {'name': result['name'], 'init_token': result['init_token']}

    local_data.add_to_node_dictionary(node_contents=node_contents, node_id=result['node_id'], node_type=result['node_type'])
    
    button.style.visibility = 'hidden'

    div.classList.toggle("clicked")
    
}

function result_in_dictionary(node_dictionary, result){

    if (Object.keys(node_dictionary).includes(result['node_type'])){
        if (Object.keys(node_dictionary[result['node_type']]).includes(result['node_id'])){
            return true;
        }else {
            return false;
        }
    } else{
        return false;
    }

}



function reset_page(){
    
    var search_input =  document.getElementById("search_input")
    search_input.disabled = false;
    search_input.value = '';

    const selecter = document.getElementById("node_type_selecter")
    selecter.disabled = false;

    var search_type_banner = document.getElementById('search_type_banner')
    search_type_banner.style.visibility = 'hidden'
    search_type_banner.innerText = ''


    var page_counter = document.getElementById('page_counter')
    page_counter.style.visibility = 'hidden'
    page_counter.innerText = 0


    var results_container_div = document.getElementById('results_container_div')
    results_container_div.innerHTML = ''

}

function next_page_btn_onclick(){

    var current_page_number = Number(document.getElementById('page_counter').innerText)

    if ( current_page_number == 0){
        return
    }
    search_btn_onclick(current_page_number+1)

}
function previous_page_btn_onclick(){
    var current_page_number = Number(document.getElementById('page_counter').innerText)

    if ( current_page_number == 0 || current_page_number == 1){
        return
    }

    search_btn_onclick(current_page_number-1)

}