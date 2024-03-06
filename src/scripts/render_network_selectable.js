
function create_table(node_type, nodes, tables_div){
    var new_table = document.createElement("table");


    new_table.setAttribute("class", "compare-table")

    let caption = new_table.createCaption();
    caption.textContent = node_type;


    new_table.id = (node_type + "_table");
    new_table.class = "compare-table";

    for (let i = 0; i < nodes.length; i++){
        

        const tr = new_table.insertRow();
        tr.setAttribute('selected', false)
        tr.setAttribute('node_id', nodes[i]["node_id"])
        
        tr.classList.add("node_table_row")

        tr.onclick = function(){
            tr.classList.toggle("active-row")

            if (tr.getAttribute('selected') == "true"){
                tr.setAttribute('selected', false)
            }else{
                tr.setAttribute('selected', true)
            }
        }
        const td_node_name = tr.insertCell();
        td_node_name.innerText = nodes[i]['name'] 

        

    };

    tables_div.appendChild(new_table)

}


function render_network_selectable(network, render_div){
    render_div.innerHTML = ''

    var nodes_split_by_type = {}

    var nodes = Object.values(network['nodes']);

    for (let i = 0; i < nodes.length; i++){
        if(!Object.keys(nodes_split_by_type).includes(nodes[i]['node_type'])){
            nodes_split_by_type[nodes[i]['node_type']] = []
        }
        nodes_split_by_type[nodes[i]['node_type']].push(nodes[i])
    }


    for (const [node_type, nodes] of Object.entries(nodes_split_by_type)) {
        create_table(node_type, nodes, render_div)
    }

}

module.exports = {render_network_selectable}