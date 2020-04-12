function EntityLists(){

    this.selectPressedRow = function(grid, index){
        grid.datagrid('selectRow', index);
        var row = grid.datagrid('getSelected');
        return row;
    }


    this.listSwitch = function(sw){
        // sw["delete"] = "<input type='button' value='Delete' id='delete-" + sw.name +"'>";
        $('#switch-datagrid').datagrid('insertRow', {index:0,row:sw});
    };

    this.listHost = function(host){
        $('#host-datagrid').datagrid('insertRow', {index:0,row:host})
    };

    this.listController = function(controller){
        $('#controller-datagrid').datagrid('insertRow', {index:0,row:controller})
    };

    this.listAllNodes = function(topo){

        for(var key in topo.switches){
            var sw = topo.switches[key];
            this.listSwitch(sw);
        }
        for(key in topo.hosts){
            var host = topo.hosts[key];
            this.listHost(host);
        }
        for(key in topo.controllers){
            var controller = topo.controllers[key];
            this.listController(controller);
        }
        // for(key in topo.links){
        //     var link = topo.links[key]
        //     this.renderLink(link);
        // }
    };

    // this.removeSwitchByKey = function(key){
    //     this.removeEntityByKey("switch", key);
    // }
    //
    // this.removeHostByKey = function(key){
    //     this.removeEntityByKey("host", key);
    // }
    //
    // this.removeControllerByKey = function(key){
    //     this.removeEntityByKey("controller", key);
    // }

    this.removeEntityByKey = function(type, key){

        var grid = this.selectGridByNodeType(type);

        var rows = grid.datagrid("getData").rows;
        console.log(rows);
        for(var i = 0; i < rows.length; i++){
            var row = rows[i];
            if(row['name'] === key){
                // console.log(row);
                grid.datagrid("deleteRow", i);
            }
        }
    }

    this.removeEntityByIndex = function(type, index){
        var grid = this.selectGridByNodeType(type);

        grid.datagrid('selectRow', index);
        grid.datagrid("deleteRow", index);
    }

    this.removeEntityByKey = function(type, key){
        var grid = this.selectGridByNodeType(type);
        var rows = grid.datagrid("getRows");
        for(var i=0; i < rows.length; i++){
            if(key === rows[i].name){
                grid.datagrid("deleteRow", i);
            }
            // console.log(rows[i].name);
        }
    }

    this.listTopology = function(topology){
        // $()
    }

    this.selectGridByNodeType = function(type){
        var grid;
        if(type === "switch"){
            grid = $('#switch-datagrid');

        }
        else if(type === "host"){
            grid = $('#host-datagrid');

        }
        else if(type === "controller"){
            grid = $('#controller-datagrid');

        }
        return grid;
    }
}

function removeSwitchBtn(value, row, index){
    return "<input type='button' onclick='removeSwitch(" + index + ")' value='Delete'>";
}

function removeSwitch(index){
    var grid = lists.selectGridByNodeType("switch");
    var row = lists.selectPressedRow(grid, index);
    vis.deleteNodeByKey(row['name']);
    lists.removeEntityByIndex("switch", index);

    topology.deleteNodeByKey(row['name']);
    for(var k in components){
        var t = components[k];
        // Topology(t);
        t.deleteNodeByKey(row['name']);
    }
    showTopos();
}

function removeHostBtn(value, row, index){
    return "<input type='button' onclick='removeHost(" + index + ")' value='Delete'>";
}

function removeHost(index){
    var grid = lists.selectGridByNodeType("host");
    var row = lists.selectPressedRow(grid, index);
    vis.deleteNodeByKey(row['name']);
    lists.removeEntityByIndex("host", index);

    topology.deleteNodeByKey(row['name']);
    for(var k in components){
        var t = components[k];
        // Topology(t);
        t.deleteNodeByKey(row['name']);
    }
    showTopos();
}

function removeControllerBtn(value, row, index){
    return "<input type='button' onclick='removeController(" + index + ")' value='Delete'>";
}

function removeController(index){
    var grid = lists.selectGridByNodeType("controller");
    var row = lists.selectPressedRow(grid, index);
    vis.deleteNodeByKey(row['name']);
    lists.removeEntityByIndex("controller", index);

    topology.deleteNodeByKey(row['name']);
    for(var k in components){
        var t = components[k];
        // Topology(t);
        t.deleteNodeByKey(row['name']);
    }
    showTopos();
}

function previewTopologyButton(value, row, index){
    return "<input type='button' onclick='previewTopology(" + index + ")' value='Preview'>";
}

function previewTopology(index){
    $('#topology-datagrid').datagrid('selectRow', index);
    var row = $("#topology-datagrid").datagrid('getSelected');
    var url = row['topology-url']
    console.log(row['topology-url']);

    $.ajax({
        type: "GET",
        url : url,
        contentType: "application/json; charset=utf-8",
        // crossDomain: true,
        success : function(data) {

            $('#topology-datagrid').trigger("event-preview-topology", data);

        },
        error: function(error){
            console.log('error');
            console.log(JSON.stringify(error));
        }
    });

}


function loadTopologyButton(value, row, index){
    return "<input type='button' onclick='loadTopology(" + index + ")' value='Load'>";
}

function loadTopology(index){

}

function deleteTopologyButton(value, row, index){
    return "<input type='button' onclick='deleteTopology(" + index + ")' value='Delete'>";
}

function connectToShaper(ele){

}


