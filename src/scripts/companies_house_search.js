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


function search_btn_onclick(search_type, page_number){

    lock.lock_screen(modals.screen_locked_modal)

    var search_input =  document.getElementById("search_input")

    search_input.disabled = true;

    var query = search_input.value;

    if (query == ""){
        return
    }
    
    var request_body = {
        'query': query,
        'page_number': page_number,
    }


    var page_counter = document.getElementById('page_counter')
    page_counter.style.visibility = 'visible'
    page_counter.innerText = page_number



    var search_type_banner = document.getElementById('search_type_banner')
    search_type_banner.style.visibility = 'visible'

    if (search_type == 'all'){
        search_type_banner.innerText = 'Search All'
        document.seach_type = search_type
    }
    else if (search_type == 'company'){
        request_body['search_type'] = search_type
        search_type_banner.innerText = 'Company Search'
        document.seach_type = search_type
    } else if (search_type == 'officer'){
        request_body['search_type'] = search_type
        search_type_banner.innerText = 'Officer Search'
        document.seach_type = search_type
    }

    mithril_request.send_mithril_request(request_body=request_body, function_name="companies_house_search", display_results, fail_handler)

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
    description.innerText = result['description']
    container_div.appendChild(description)

    var address = document.createElement('p')
    address.innerText = result['address_snippet']
    container_div.appendChild(address)

    var add_to_dictionary_btn = document.createElement('button')
    add_to_dictionary_btn.innerText = node_in_dictionary ? 'update' : 'add';
    add_to_dictionary_btn.addEventListener('click', function(){
        add_result_to_dictionary(result, node_in_dictionary, container_div, add_to_dictionary_btn)
     });
    container_div.appendChild(add_to_dictionary_btn)

    result_div.appendChild(container_div)


    return result_div

}

function add_result_to_dictionary(result, node_in_dictionary, div, button){
    if (node_in_dictionary){
        local_data.update_node_definition(new_definition=result, node_id=result['node_id'], node_type=result['kind'])
    }else{
        local_data.add_to_node_dictionary(node_definition=result, node_id=result['node_id'], node_type=result['kind'])
    }

    button.style.visibility = 'hidden'

    div.classList.toggle("clicked")
    
}


function result_in_dictionary(node_dictionary, result){

    if (Object.keys(node_dictionary).includes(result['kind'])){
        if (Object.keys(node_dictionary[result['kind']]).includes(result['node_id'])){
            return true;
        }else {
            return false;
        }
    } else{
        return false;
    }

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

function reset_page(){
    
    var search_input =  document.getElementById("search_input")
    search_input.disabled = false;
    search_input.value = '';

    document.seach_type = null;

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
    search_btn_onclick(document.seach_type, current_page_number+1)

}
function previous_page_btn_onclick(){
    var current_page_number = Number(document.getElementById('page_counter').innerText)

    if ( current_page_number == 0 || current_page_number == 1){
        return
    }

    search_btn_onclick(document.seach_type, current_page_number-1)

}