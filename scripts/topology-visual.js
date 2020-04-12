function Visualizer(instance, topology){

/*-------------------- static variables --------------------*/
    Visualizer.currentNode = null;
    // this.currentLink;
    // this.action;




/*-------------------- instance variables --------------------*/
    this.topology = topology;
    this.instance = instance;




/*-------------------- instance functions --------------------*/
    this.renderNode = function(node) {
        // console.log("rendering " + node.name)
        // var d = this.createNode(node.x, node.y, node.subType, node.name);
        // this.mobilizeNode(d);
        // return d;

        var d = document.createElement("div");
        d.id = node.name;
        d.className = "node";
        d.setAttribute("node-type", node.nodeType);
        d.setAttribute("sub-type", node.subType);
        if(node.nodeType === "controller"){
            d.innerHTML = "<img src='../img/"+ node.subType +".png' onclick='myFunc()'><br>" +  node.name + "<br></div>";
        }
        else{
            d.innerHTML = "<img src='../img/"+ node.subType +".png' onclick='myFunc()'><br>" +  node.name + "<br><div class=\"linker\"></div>";
        }
        d.style.left = node.x + "px";
        d.style.top = node.y + "px";
        this.instance.getContainer().appendChild(d);

        $(d).bind("contextmenu", function(e){
            Visualizer.currentNode = d;
            e.preventDefault();
            $('#node-menu').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        });

        this.mobilizeNode(d);
    };




    // this.createNode = function(x, y, type, nodeID){
    //     var d = document.createElement("div");
    //     d.id = nodeID;
    //     d.className = "node";
    //     d.setAttribute("node-type", type);
    //     if(type === "controller"){
    //         d.innerHTML = "<img src='../img/"+ type +".png' onclick='myFunc()'><br>" +  nodeID + "<br></div>";
    //     }
    //     else{
    //         d.innerHTML = "<img src='../img/"+ type +".png' onclick='myFunc()'><br>" +  nodeID + "<br><div class=\"linker\"></div>";
    //     }
    //     d.style.left = x + "px";
    //     d.style.top = y + "px";
    //     this.instance.getContainer().appendChild(d);
    //
    //     $(d).bind("contextmenu", function(e){
    //         Visualizer.currentNode = d;
    //         e.preventDefault();
    //         $('#node-menu').menu('show', {
    //             left: e.pageX,
    //             top: e.pageY
    //         });
    //     });
    //
    //     return d;
    // };

    this.renderLink = function(link){
        var l = this.instance.connect({source: link.source, target: link.target, type: "basic" });
        l.name = link.name;

        return l;
    };

    this.mobilizeNode = function(el){
        this.instance.draggable(el);

        this.instance.makeSource(el, {
            filter: ".linker",
            anchor: "Continuous",
            connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
            connectionType:"basic",
            extract:{
                "action":"the-action"
            }/*,
            maxConnections: 2,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }*/
        });

        this.instance.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous"
        });

        // this.instance.fire("jsPlumbDemoNodeAdded", el);
    };

    this.renderTopology = function(topo){
        // console.log("rendering topology...")
        for(var key in topo.switches){
            var sw = topo.switches[key];
            this.renderNode(sw);
        }
        for(key in topo.hosts){
            var host = topo.hosts[key];
            this.renderNode(host);
        }
        for(key in topo.links){
            var link = topo.links[key];
            this.renderLink(link);
        }
        // console.log("finished rendering topology...")
    };

    this.setPosition = function(el, x, y){
        el.css({'position':'absolute', 'left':x1,'top':y1});
    };

    this.connect = function(sourceNode, targetNode){
        this.instance.connect({ source: sourceNode.name, target: targetNode.name, type:"basic" });
    };

    this.findLinksByNode = function(key){
        var linkList = [];
        var connections = this.instance.getAllConnections();
        console.log(connections);

        for(var i = 0; i < connections.length; i++){
			var link = connections[i];

			var source = link.source.id;
			var target = link.target.id;

            console.log(key + " " + source + " " + target);

			if(source === key){
			    linkList.push(link);
            }

            if(target === key){
			    linkList.push(link);
            }

            // console.log(linkList);
            return linkList;
		}
    }

    this.deleteNodeByKey = function(key){

        var connections = this.instance.getAllConnections();
        console.log(connections);
        var linkList = [];
        for(var i = 0; i < connections.length; i++) {
            var link = connections[i];

            var source = link.source.id;
            var target = link.target.id;

            // console.log(key + " " + source + " " + target);

            if (source === key || target === key) {
                // console.log(link);
                // this.deleteLink(link);
                linkList.push(link);
            }
        }
        // console.log("links to delete");
        // console.log(linkList);

        for(var i = 0; i < linkList.length; i++){
            var link = linkList[i];
            this.deleteLink(link);
        }


        this.topology.deleteNodeByKey(key);
        $("#" + key).remove();
        //用于同步删除实体栏
        $("#entities-" + key).remove();
    };

    this.deleteLink = function(link){
        // console.log(link);
        this.instance.deleteConnection(link);
        this.topology.deleteLinkByKey(link.name);


    };
}