function Tree(depths, branches, density){

    if(depths < 2){
        alert("Depths must be great than 1");
        return null;
    }

    this.topology = new Topology();
    // this.topology = Topology();
    // this.hostDefaults;
    // this.switchDefaults;

    var canvasWidth = 900;
    var canvasHeight = 800;

    var nodeList = [];

    var vGaps = depths + 3;
    var vGapValue = canvasHeight / vGaps;


    console.log(vGaps + " " + vGapValue)

    var left = 0;
    var right = 0;

    for(var i = 0; i < depths; i++){

        nextLeft = left + Math.pow(branches, i);
        right = nextLeft - 1;

        // console.log("left: " + left + ", right: " + right);

        var iNodes = Math.pow(branches, i);
        var iHGaps = iNodes + 1;
        var iHGapValue = canvasWidth / iHGaps;


        for(var j = 0; j < iNodes; j++){
            var x = iHGapValue * (j + 1);
            var y = vGapValue * (i + 1);

            var sw = new Switch(switchDefaults['switch-type'], switchDefaults['of-protocol'], x, y);
            this.topology.addSwitch(sw);

            nodeList.push(sw);

            if(left == 0) continue;

            var treeIndex = left + j;//switch index in the tree.
            var parentIndex = Math.floor((treeIndex - 1) / branches);
            var parent = nodeList[parentIndex];

            var link = new Link(sw, parent);
            this.topology.addLink(link);
        }

        if(i == depths - 1){
            var hostNumber = iNodes * density;
            var iHHostGapValue = canvasWidth / hostNumber;
            console.log(hostNumber);
            for(var k = 0; k < hostNumber; k++){
                var xh = iHHostGapValue * (k + 0.5);
                var yh = vGapValue * (i + 2);

                var host = new Host(hostDefaults['host-type'], nextIPv4(hostDefaults['ip-base'], Host.total, hostDefaults['ip-prefix']), xh, yh);
                host.image = hostDefaults['image'];
                // var host = new Host("server", ("192.168.1." + (k + 1) + "/24"), xh, yh);
                this.topology.addHost(host);

                var swIndex = Math.floor(left + (k) / density);
                var parentSW = nodeList[swIndex];

                var link2 = new Link(host, parentSW);
                this.topology.addLink(link2);

            }

        }

        left = nextLeft;
    }
    this.status = Topology.STATUS_MODIFIED;
    return this.topology;
}