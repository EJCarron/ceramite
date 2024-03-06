const { resolve } = require('path')
const fs = require('fs')
const network_library_path = 'data/network_library.json'

function add_new_network(network){

    var added_to_library_successfully = add_network_to_library(network)

    if (!added_to_library_successfully){
        return false;
    }

    var json_path = render_network_path(network['name'])

    fs.writeFileSync(json_path, JSON.stringify(network))

    return true;
}

function update_existing_network(network){

    if (!network_is_in_library(network)){
        console.log('network is not in library')
        return false;
    }

    var json_path = render_network_path(network['name'])

    fs.writeFileSync(json_path, JSON.stringify(network))

    return true;
}

function network_is_in_library(network){
    var network_library = get_network_library();
    
    for (const [uuid, network_name] of Object.entries(network_library)) {
        if (uuid == network['network_uuid'] && network_name == network['name']){
            return true;
        }
    }

    return false;
}


function network_is_duplicate(network){
    var network_library = get_network_library();
    
    for (const [uuid, network_name] of Object.entries(network_library)) {
        if (uuid == network['network_uuid'] && network_name == network['name']){
            console.log('network already exists');
            return true;
        }else if(uuid == network['network_uuid']){
            console.log('network with same uuid but different name already in library');
            return true;
        }else if (network_name == network['name']){
            console.log('network with same name but different uuid already in library.')
            return true;
        }
      }

    return false;
}

function get_network(network_name){

    if (!name_in_library(network_name)){
        console.log('network not in library')
        return null;
    }

    var json_path = render_network_path(network_name)

    var network = JSON.parse(fs.readFileSync(json_path));

    return network
}

function init_library(){
    if (fs.existsSync(network_library_path)){
        return true
    }else{
        fs.writeFileSync(network_library_path, JSON.stringify({}))
    }
}


function get_network_library(){
    init_library()

    var network_library = JSON.parse(fs.readFileSync(network_library_path))

    return network_library

}

function add_network_to_library(network){

    if (network_is_duplicate(network)){
        return false
    }

    var network_library = get_network_library()

    network_library[network['network_uuid']] = network['name']

    fs.writeFileSync(network_library_path, JSON.stringify(network_library))

    return true;


}

function name_in_library(network_name){
    var network_library = get_network_library()

    if (Object.values(network_library).includes(network_name)){
        return true;
    }else{
        return false;
    }
}

function get_network_name_list(){

    var network_library = get_network_library()
    var name_list = []

    for (const [uuid, name] of Object.entries(network_library)) {
        name_list.push(name)
    }

    return name_list;
}

function get_name_from_uuid(network_uuid){
    var network_library = get_network_library()
    
    return network_library[network_uuid] ?? null;

}

function render_network_path(network_name){
    return 'data/' + network_name + '.json'
}

module.exports = {update_existing_network, add_new_network, get_network, name_in_library, get_network_name_list, get_name_from_uuid}