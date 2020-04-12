$(function () {
    const topology = src.modules.topology;
    $.extend(topology, {
        load: function(topoFile){
            this.status = Topology.STATUS_LOADED;
        },
        addVnf: function(vnf){
            this.vnfs[vnf.name] = vnf;
            this.status = Topology.STATUS_MODIFIED;
        },
        addServer:function(server){
            this.servers[server.name]=server;
            this.status = Topology.STATUS_MODIFIED;
        },
        addController: function(ctlr){
            this.controllers[ctlr.name] = ctlr;
            this.status = Topology.STATUS_MODIFIED;
        },
        addSwitch: function(sw){
            this.switches[sw.name] = sw;
            this.status = Topology.STATUS_MODIFIED;
        },
        addHost: function(host){
            this.hosts[host.name] = host;
            this.status = Topology.STATUS_MODIFIED;
        },
        addRouter: function(router){
            this.routers[router.name] = router;
            this.status = Topology.STATUS_MODIFIED;
        },
        addLink: function(link){
            this.links[link.name] = link;
            this.status = Topology.STATUS_MODIFIED;
        },
        merge: function(part){
            $.extend(this.switches, part.switches);
            $.extend(this.hosts, part.hosts);
            $.extend(this.links, part.links);
            part.status = Topology.STATUS_MERGED;
            this.status = Topology.STATUS_MODIFIED;
        },
        clear: function(){
            this.controllers = {};
            this.switches = {};
            this.hosts = {};
            this.links = {};
            this.status = Topology.STATUS_CLEARED;
        },
        getSwitch: function(key){
            return this.switches[key];
        },
        getHost: function(key){
            return this.hosts[key];
        },
        getController: function(key){
            return this.controllers[key];
        },
        getLink: function(key){
            return this.links[key];
        },
        deleteNodeByKey: function(key){

            delete this.switches[key];
            delete this.hosts[key];
            delete this.controllers[key];

            for(var k in this.links){
                var link = this.links[k];
                if(link.source === key || link.target === key){
                    delete this.links[k];
                }
            }
            this.status = Topology.STATUS_MODIFIED;

        },
        deleteLinkByKey: function(key){
            delete this.links[key];
            this.status = Topology.STATUS_MODIFIED;
        },
        removeSwitchBtn: function (value, row, index){
            return "<input type='button' onclick='removeSwitch(" + index + ")' value='Delete'>";
        },
        removeSwitch: function (index){
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
        },
        removeHostBtn: function (value, row, index){
            return "<input type='button' onclick='removeHost(" + index + ")' value='Delete'>";
        },
        removeHost: function (index){
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
        },
        removeControllerBtn: function (value, row, index){
            return "<input type='button' onclick='removeController(" + index + ")' value='Delete'>";
        },
        removeController: function (index){
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
        },
        previewTopologyButton: function (value, row, index){
            return "<input type='button' onclick='previewTopology(" + index + ")' value='Preview'>";
        },
        previewTopology: function (index){
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

        },
        loadTopologyButton: function (value, row, index){
            return "<input type='button' onclick='loadTopology(" + index + ")' value='Load'>";
        },
        loadTopology: function (index){

        },
        deleteTopologyButton: function (value, row, index){
            return "<input type='button' onclick='deleteTopology(" + index + ")' value='Delete'>";
        },
        connectToShaper: function (ele){

        }
    });
});