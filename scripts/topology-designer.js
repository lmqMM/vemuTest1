var ctrlDefaults = {};
var hostDefaults = {};
var switchDefaults = {};
var serverDefaults = {};
var linkDefaults = {};

// var eTopo;
var sTopo;
var topology;
var components = {};
var targetTopo;

var lists;
var vis;

// var url;
// var host;
// var port;
var ip_domain;
var master_api_port;

var current_interface;
var current_link;
var current_source;
var current_target;

$.ajax({
        type: "GET",
        //url : "../config/floodlight.json",
        //url:"../config/jsontest.json",
        url : "../config-new/image_list.json",
        contentType: "application/json; charset=utf-8",
        // url: "http://47.106.96.178:5001/registry/imagemgr/info",
        //dataType: "jsonp",
        //contentType: "application/json; charset=utf-8",
        crossDomain: true,
        success:function (data) {
            // console.log(data);
            var image_counts = 1;
            var category_index = 0;
            var left_bench = 100;
            var width = 80;
            var top_bench = 60;
            for(var category_key in data){

                var category = data[category_key];
                category_index++;

                for(var image_index in category){
                    var image = category[image_index]
                    var left = left_bench + image_counts * width;
                    var top = 5;
                    // console.log()
                    $('#canvas .gallery').append('<div class="node dragger" id="'+image['id']+'" node-type="'+image['node-type']+'" sub-type="'+image['id']+'" image="'+image['image']+'" style="left:'+left+'px;top:'+top+'px"><img src="../img/'+image['id']+'.png"/><br>'+image['id']+'</div>')
                    //$('#canvas .gallery').append('<div class="node dragger" id="'+image['imageName']+'" node-type="'+image['imageType']+'" sub-type="'+image['imageName']+'" image="'+image['image']+'" style="left:'+left+'px;top:'+top+'px"><img src="../img/'+image['imageName']+'.png"/><br>'+image['imageName']+'</div>')
                    //$('#canvas .gallery').append('<div class="node dragger" id="'+image['imageName']+'" node-type="'+image['imageType']+'" sub-type="'+image['imageName']+'" image="'+image['image']+'" style="left:'+left+'px;top:'+top+'px"><img src="../img/'+image['imageName']+'.png"/><br>'+image['imageName']+'</div>')
                    image_counts++
                }

            }
        },
        /*success:function(data){
            var image_counts = 1;
            var left_bench = 100;
            var left = left_bench + image_counts * width;
            var top = 5;
            $('#canvas .gallery').append('<div class="node dragger" id="'+data['imageName']+'" node-type="'+data['imageType']+'" sub-type="'+data['imageName']+'" image="'+data['image']+'" style="left:'+left+'px;top:'+top+'px"><img src="../img/'+data['imageName']+'.png"/><br>'+data['imageName']+'</div>')
            image_counts++
            var width = 80;
        },*/
        /*success:function(data){
            var dataobj = data;
            //var image_counts = 1;
            //var left_bench = 100;
            //var width = 80;
            //var left = left_bench + image_counts * width;
            //var top = 5;
            $.each(dataobj,function (index,item) {
                $('#canvas .gallery').append('<div class="node dragger" id="'+item['imageName']+'" node-type="'+item['imageType']+'" sub-type="'+item['imageName']+'" image="'+item['image']+item['imageName']+'.png"/><br>'+item['imageName']+'</div>')
                $(document).ready(function () {
                    $("#ubuntu").css({'left':'460px','top':'5px'});
                })
            }
            )
        },*/
        error:function (error) {
            console.log(error);
        }
    })

jsPlumb.ready(function () {

    console.log("hello topostack!!!!!");
    console.log(window.location.host);
    url = window.location.href;
    host = window.location.host;
    port = window.location.port;

    ip_domain = host.replace(":" + port, "")
    // console.log(ip_domain)



    /*-------------------- variables --------------------*/
    Switch.total = 0;
    Host.total = 0;
    Controller.total = 0;
    Link.total = 0;
    SERVER.total = 0;
    VNF.total = 0;
    Router.total = 0;
    Topology.total = 0;



    topology = new Topology();
    lists = new EntityLists();
	
	var canvasHeight = $("#canvas").height();
	var canvasWidth = $("#canvas").width();



	var x1, x2, y1, y2;

	var currentTopoFile = "";



	/*-------------------- functions --------------------*/

    $.ajax({
	    type: "GET",
	    url : "../config/master.json",
        contentType: "application/json; charset=utf-8",

        success : function(data) {
            // console.log(data)

            master_api_port = data["deployment-port"]
        },
        error: function(error){
            alert("error");
        }
	});

    function configToPropertyGrid(jsonObj){
        var total = Object.keys(jsonObj).length;

        var rows = [];
        for(var i = 0; i < total; i++){
            var name = Object.keys(jsonObj)[i];
            var value = Object.values(jsonObj)[i];
            var row = {"name": name, "value": value, "editor": "text"}
            rows.push(row)
        }

        var pgdata = {
            "total": total,
            "rows": rows
        };

        return pgdata;
    };





    /*-------------------- jsPlumb settings --------------------*/

    // setup some defaults for jsPlumb.
    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        Connector:"StateMachine",
        HoverPaintStyle: {stroke: "#1e8151", strokeWidth: 2 },
//        ConnectionOverlays: [
//            [ "Arrow", {
//                location: 1,
//                id: "arrow",
//                length: 14,
//                foldback: 0.8
//            } ],
//            [ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
//        ],
        Container: "canvas"
    });

    instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });

    window.jsp = instance;

    var canvas = document.getElementById("canvas");
    var windows = jsPlumb.getSelector(".node, .network");
    vis = new Visualizer(instance, topology);

        // suspend drawing and initialise.
    instance.batch(function () {
        for (var i = 0; i < windows.length; i++) {
            // console.log(windows[i]);
            vis.mobilizeNode(windows[i]);
        }


    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);


    instance.bind("beforeDrop", function(info){
        console.log("dropping......");
        var source = info.connection.source;
        var target = info.connection.target;

        current_source = source;
        current_target = target;

        var sourceId = source.getAttribute('id');
        var targetId = target.getAttribute('id');
        var sourceType = source.getAttribute('node-type');
        var targetType = target.getAttribute('node-type');
        var sourceSubType = source.getAttribute('sub-type');
        var targetSubType = target.getAttribute('sub-type');


        // console.log(info);

        // $("#device-interface-selector").setAttribute('title', 'test...')

        var link = new Link2(sourceId, targetId, sourceType, targetType);
        // console.log(link);
        // bug 修复，添加Link信息到topology
        topology.addLink(link);
        var intname = sourceId + targetId;
        //topology.switches[sourceId].interfaces.intname = intname;

        if (sourceType == 'host') {
            if (targetType == 'host') {
                topology.hosts[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.hosts[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'router') {
                topology.hosts[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.routers[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'controller') {
                topology.hosts[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.controllers[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'switch') {
                topology.hosts[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.switches[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'vnf') {
                topology.hosts[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.vnfs[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
        }
        if (sourceType == 'router') {
            if (targetType == 'router') {
                topology.routers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.routers[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'host') {
                topology.routers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.hosts[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'controller') {
                topology.routers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.hosts[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'switch') {
                topology.routers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.switches[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'vnf') {
                topology.routers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.vnfs[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
        }
        if (sourceType == 'controller') {
            if (targetType == 'controller') {
                topology.controllers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.controllers[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'host') {
                topology.controllers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.hosts[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'router') {
                topology.controllers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.routers[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'switch') {
                topology.controllers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.switches[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'vnf') {
                topology.controllers[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.vnfs[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
        }
        if (sourceType == 'switch') {
            if (targetType == 'switch') {
                topology.switches[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.switches[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'host') {
                topology.switches[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.hosts[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'router') {
                topology.switches[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.routers[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'controller') {
                topology.switches[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.controllers[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'vnf') {
                topology.switches[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.vnfs[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
        }
        if (sourceType == 'vnf') {
            if (targetType == 'vnf') {
                topology.vnfs[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.vnfs[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'host') {
                topology.vnfs[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.hosts[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'router') {
                topology.vnfs[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.routers[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'controller') {
                topology.vnfs[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.controllers[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
            if (targetType == 'switch') {
                topology.vnfs[sourceId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
                topology.switches[targetId].interfaces.push({
                    'name': intname,
                    'ip': '192.168.1.1',
                    'netmask': '255.255.255.0'
                });
            }
        }

        // router
        // if (sourceType == 'router' && targetType == 'host') {
        //     topology.routers[sourceId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        //     topology.hosts[targetId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        // }
        // if (sourceType == 'host' && targetType == 'router') {
        //     topology.hosts[sourceId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        //     topology.routers[targetId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        // }
        // if (sourceType == 'router' && targetType == 'controller') {
        //     topology.routers[sourceId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        //     topology.controllers[targetId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        // }
        // if (sourceType == 'controller' && targetType == 'router') {
        //     topology.controllers[sourceId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        //     topology.routers[targetId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        // }
        // if (sourceType == 'router' && targetType == 'switch') {
        //     topology.routers[sourceId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        //     topology.switches[targetId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        // }
        // if (sourceType == 'switch' && targetType == 'router') {
        //     topology.switches[sourceId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        //     topology.routers[targetId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        // }
        // if (sourceType == 'router' && targetType == 'vnf') {
        //     topology.routers[sourceId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        //     topology.vnfs[targetId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        // }
        // if (sourceType == 'vnf' && targetType == 'router') {
        //     topology.vnfs[sourceId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        //     topology.routers[targetId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        // }
        // if (sourceType == 'router' && targetType == 'router') {
        //     topology.routers[sourceId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        //     topology.routers[targetId].interfaces.push({
        //         'name': intname,
        //         'ip': '192.168.1.1',
        //         'netmask': '255.255.255.0'
        //     });
        // }

        var l = vis.renderLink(link);

        showTopos();
        // current_link = link;

        // if(sourceSubType == 'shaper' && targetSubType != 'shaper'){
        //
        //     console.log("----------------------------------------------- in the source shaper branch")
        //     $('#shaper-id').text(sourceId);
        //     var win = $("#device-interface-selector").window('open');
        //     sourceId += "---" + current_interface;
        //
        //     link = new Link2(sourceId, targetId, sourceType, targetType);
        //     topology.addLink(link);
        // }
        // else if(targetSubType == 'shaper' && sourceSubType != 'shaper' ){
        //     console.log("----------------------------------------------- in the target shaper branch")
        //     $('#shaper-id').text(targetId);
        //     var win = $("#device-interface-selector").window('open');
        //     targetId += "---" + current_interface;
        //
        //     link = new Link2(sourceId, targetId, sourceType, targetType);
        //     topology.addLink(link);
        // }
        // else if(sourceSubType == 'shaper' && targetSubType == 'shaper'){
        //     console.log("----------------------------------------------- in both shapers branch")
        //     $('#shaper-id').text(sourceId);
        //     var win = $("#device-interface-selector").window('open');
        //     sourceId += "---" + current_interface;
        //
        //     $('#shaper-id').text(targetId);
        //     var win = $("#device-interface-selector").window('open');
        //     targetId += "---" + current_interface;
        //
        //     link = new Link2(sourceId, targetId, sourceType, targetType);
        //     topology.addLink(link);
        // }
        // else

        if(sourceSubType != 'shaper' && targetSubType != 'shaper'){
            console.log("----------------------------------------------- no shaper");
            topology.addLink(link);
        }
        else if(sourceSubType == 'shaper' && targetSubType == 'shaper'){
            alert("currently, directly connecting two shapers are not supported. ")
        }
        else{
            var win = $("#device-interface-selector").window('open');
        }




        // win.append('<label>test: </label><input name="interface" type="radio" value="apple"><br>');
        // win.append('<label>test: </label><input name="interface" type="radio" value="apple"><br>');
        // win.setAttribute('title', "test");
        // console.log();
        // console.log(win.children())

        // if(source)


        // link = new Link2(sourceId, targetId, sourceType, targetType);

        // topology.addLink(link);
		// topology.status = Topology.STATUS_MODIFIED;



	});

	
    /*-------------------- interactions --------------------*/



	$.ajax({
	    type: "GET",
	    url : "../config/network_defaults.json",
        contentType: "application/json; charset=utf-8",

        success : function(data) {
            // console.log(data)

            ctrlDefaults = data['controller-defaults'];
            hostDefaults = data['host-defaults'];
            switchDefaults = data['switch-defaults'];
            linkDefaults = data['link-defaults'];
            serverDefaults = data['server-defaults'];

            var ctrlDefaultsPG = configToPropertyGrid(ctrlDefaults);
            var hostDefaultsPG = configToPropertyGrid(hostDefaults);
            var switchDefaultsPG = configToPropertyGrid(switchDefaults);
            var linkDefaultsPG = configToPropertyGrid(linkDefaults);
            var serverDefaultsPG = configToPropertyGrid(serverDefaults);

            $('#controller-defaults').datagrid('loadData',ctrlDefaultsPG);
            $('#host-defaults').datagrid('loadData',hostDefaultsPG);
            $('#switch-defaults').datagrid('loadData',switchDefaultsPG);
            $('#link-defaults').datagrid('loadData',linkDefaultsPG);
        },
        error: function(error){
            alert("error");
        }
	});

    $('#topology-datagrid').bind("event-preview-topology", function(event, data){
        // alert('good');
        // console.log(JSON.stringify(data));
        // console.log(data);
        // var t = JSON.parse(data);
        // console.log(t);
        $('#topology-preview-window').window('open');
        var insPrev = jsPlumb.getInstance({
            Endpoint: ["Dot", {radius: 2}],
            Connector:"StateMachine",
            HoverPaintStyle: {stroke: "#1e8151", strokeWidth: 2 },
            Container: "canvas-preview"
        });

        insPrev.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });

        $("#topology-preview-window").jsp = insPrev;

        var visPrev = new Visualizer(insPrev, data);
        visPrev.renderTopology(data);
        // vis.Container = "canvas-preview";
        // vis.renderTopology(data);
    })

    $("#new-app").click(function(){
        $("#application-templates").window('open');
    });

    $("#interface-select-ok").click(function(){

        current_interface = $("input[name='interface']:checked").val();
        console.log(current_interface);

        var sourceId = current_source.getAttribute('id');
        var targetId = current_target.getAttribute('id');
        var sourceType = current_source.getAttribute('node-type');
        var targetType = current_target.getAttribute('node-type');
        var sourceSubType = current_source.getAttribute('sub-type');
        var targetSubType = current_target.getAttribute('sub-type');

        if(sourceSubType == 'shaper' && targetSubType != 'shaper'){

            console.log("----------------------------------------------- in the source shaper branch")
            $('#shaper-id').text(sourceId);
            sourceId += "---" + current_interface;


        }
        else if(targetSubType == 'shaper' && sourceSubType != 'shaper' ){
            console.log("----------------------------------------------- in the target shaper branch")
            $('#shaper-id').text(targetId);
            targetId += "---" + current_interface;

            // link = new Link2(sourceId, targetId, sourceType, targetType);
            // topology.addLink(link);
        }
        // else if(sourceSubType == 'shaper' && targetSubType == 'shaper'){
        //     console.log("----------------------------------------------- in both shapers branch")
        //     $('#shaper-id').text(sourceId);
        //     // var win = $("#device-interface-selector").window('open');
        //     sourceId += "---" + current_interface;
        //
        //     $('#shaper-id').text(targetId);
        //     // var win = $("#device-interface-selector").window('open');
        //     targetId += "---" + current_interface;
        //
        //     link = new Link2(sourceId, targetId, sourceType, targetType);
        //     topology.addLink(link);
        // }

        link = new Link2(sourceId, targetId, sourceType, targetType);
        topology.addLink(link);

        $("#device-interface-selector").window('close');

        showTopos();
    });

    $("#interface-select-cancel").click(function(){

        $("#device-interface-selector").window('close');
    });

    $("#web-app-deploy").click(function(){

        console.log("deploying application...");

        var webApp = new WebApplication(jsPlumbUtil.uuid(), "this is a simple web application", "web-app");

        var servers = $("#web-app-servers").val().replace(/\s*/g,'').split(",");
        for(var i = 0; i < servers.length; i++){
            //  console.log(servers[i]);
             webApp.servers.push(servers[i]);
        }
        var serverScript = $("#web-app-server-script").val();
        webApp.serverScript = serverScript;

        var clients = $("#web-app-clients").val().replace(/\s*/g,'').split(",");
        for(var i = 0; i < clients.length; i++){
            //  console.log(servers[i]);
             webApp.clients.push(clients[i]);
        }
        var clientScript = $("#web-app-client-script").val();
        webApp.clientScript = clientScript;

        console.log(webApp);

        $.ajax({
			type: "POST",
			// url : "http://localhost:5000/api/application/deploy",
            url: "http://localhost:5000/api/application/bulk-deploy",
//			contentType: "application/json; charset=utf-8",
//			data:topology,
	        data: {
			    "topology-name":topology.name,
                "application":JSON.stringify(webApp)
            },
	        dataType: "jsonp",
	        crossDomain: true,
			success : function(data) {
                console.log(data)
                alert("Application deployed successfully!");
			},
			error: function(error){
			    console.log(error);
			    alert('Error!');
			}
		});

        $("#application-templates").window('close');
    });

    $("#web-app-cancel").click(function(){
        $("#application-templates").window('close');
    });


	$("#tree-ok").click(function(){

        var depths = parseInt($("#tree-depths").val());
        var branches = parseInt($("#tree-branches").val());
        var density = parseInt($("#tree-density").val());

        var tree = new Tree(depths, branches, density);
        vis.renderTopology(tree);
        lists.listAllNodes(tree);
        components[tree.name] = tree;

        topology.status = Topology.STATUS_MODIFIED;

        $("#topology-templates").window('close');

        showTopos();
	});

	$("#tree-cancel").click(function(){
        $("#topology-templates").window('close');
	});
	
	$(".template").mousedown(function(event){
		x1 = $(this).position().left;
		y1 = $(this).position().top;
	});
	
	$(".template").mouseup(function(event){
		var en = $(this);
		en.css({'position':'absolute', 'left':x1,'top':y1});
		var win = $("#topology-templates").window('open');

	});
    
    $(".dragger").mousedown(function(event){ //获取鼠标按下的位置

		x1 = $(this).position().left;
		y1 = $(this).position().top;

	});
    
    $(".dragger").mouseup(function(event){//鼠标释放

		x2 = $(this).position().left;
		y2 = $(this).position().top;

		$(this).css({'position':'absolute', 'left':x1,'top':y1});
    
    	var nodeType = $(this).attr("node-type");
    	var subType = $(this).attr("sub-type");


        if(topology.status == Topology.STATUS_CREATED || topology.status == Topology.STATUS_MODIFIED){
            targetTopo = topology;
        }
        else if(topology.status == Topology.STATUS_SAVED){
            targetTopo = new Topology();
            components[targetTopo.name] = targetTopo;
        }

    	if(nodeType === "host"){
    	    // var host = new Host(hostDefaults['host-type'], nextIPv4(hostDefaults['ip-base'], Host.total, hostDefaults['ip-prefix']), x2, y2);
    	    //var host = new Host(subType, nextIPv4(hostDefaults['ip-base'], Host.total, hostDefaults['ip-prefix']), x2, y2);
            // var hostIn = new HostIn(subType, nextIPv4(hostDefaults['ip-base'], Host.total, hostDefaults['ip-prefix']), hostDefaults['netmask']);
            // var hostcon = new HostCon(hostDefaults['config_name']);
            var host = new Host(subType, nextIPv4(hostDefaults['ip-base'], Host.total, hostDefaults['ip-prefix']), x2, y2, hostDefaults['virtualization']);
            host.image = $(this).attr('image');
            targetTopo.addHost(host);
            vis.renderNode(host);
            lists.listHost(host);

    	}
    	else if(nodeType === "switch"){
            // var sw = new Switch(switchDefaults['switch-type'], switchDefaults['of-protocol'], x2, y2);
            //var sw = new Switch(subType, switchDefaults['of-protocol'], x2, y2);
            var swhost = new SwitchHost(switchDefaults['qos']);
            // var swIn = new SwitchIn(switchDefaults['intname']);
            var sw = new Switch(subType, swhost, x2, y2);
            sw.image = $(this).attr('image');
            targetTopo.addSwitch(sw);
            vis.renderNode(sw);
            lists.listSwitch(sw);
    	}
    	else if(nodeType === "controller"){
            // console.log("adding controller");
            // var controller = new Controller(ctrlDefaults['controller-type'], ctrlDefaults['ip'], "6653", x2, y2)
            var controller = new Controller(subType, ctrlDefaults['ip'], "6653", x2, y2);
            controller.image = $(this).attr('image');
            targetTopo.addController(controller);
            vis.renderNode(controller);
            lists.listController(controller);
        }
    	else if(nodeType === "vnf"){

    	    //var vnfIn = new
            // var vnfIn = new VNFIn(subType, nextIPv4(hostDefaults['ip-base'], Host.total, hostDefaults['ip-prefix']), hostDefaults['netmask']);
    	    var vnf = new VNF(subType, x2, y2);
    	    vnf.image = $(this).attr('image');
            targetTopo.addVnf(vnf);
            vis.renderNode(vnf);
        //    lists.listController(controller);
        }
    	else if (nodeType === "server") {
    	    var serverIn = new SERVERIn(subType, nextIPv4(hostDefaults['ip-base'], Host.total, hostDefaults['ip-prefix']), hostDefaults['netmask']);
    	    var server = new SERVER(subType, x2, y2,serverIn);
    	    vnf.image = $(this).attr('image');
            targetTopo.addServer(server);
            vis.renderNode(server);

        }
    	else if(nodeType === "router"){
    	    var router = new Router(subType, x2, y2);
    	    router.image = $(this).attr('image');
    	    targetTopo.addRouter(router)
            vis.renderNode(router)
        }
    	else if(nodeType === "lan"){
    	    // alert("a lan")
        }

        topology.status = Topology.STATUS_MODIFIED;

        showTopos();
	});



	$("#undeploy-topology").click(function(){

        console.log("destroy..." + topology.name);

        $.ajax({
			type: "POST",
			url : "http://localhost:5678/api/topology/undeploy",
//			contentType: "application/json; charset=utf-8",
//			data:topology,
	        data: {"topology-name":topology.name},
	        dataType: "jsonp",
	        crossDomain: true,
			success : function(data) {
                alert("Topology undeployed successfully!");
			},
			error: function(error){
			    alert('Error!');
			}
		});
    });
	
    $("#deploy-topology").click(function(){

        console.log("deploying..." + currentTopoFile);

        $.ajax({
			type: "POST",
			url : "http://localhost:5000/api/topology/bulk-deploy",
            // url : "http://localhost:5000/api/topology/deploy",
//			contentType: "application/json; charset=utf-8",
			data:{"topology": JSON.stringify(topology)
                    // , "topoFile":jsPlumbUtil.uuid() + ".json"
                },
	        // data: {"topoFile":currentTopoFile},
	        dataType: "jsonp",
	        crossDomain: true,
			success : function(data) {
                console.log(data)
                alert("Topology deployed successfully!");
			},
			error: function(error){
			    console.log(error);
			    alert('Error!');
			}
		});
    });

	$('#save-topology').click(function(){
	    console.log('saving...')

	    if(topology.status == Topology.STATUS_CREATED){
            alert("Nothing to save. ");
            return;
	    }
        else if(topology.status == Topology.STATUS_MODIFIED){
//            topology.links = [];
            for(var key in components){
                var part = components[key];
                if(part.status != Topology.STATUS_MERGED){
                    part.status = Topology.STATUS_MERGED;
                    topology.merge(part);
                    // components[key] = {};
                    delete components[key];
                }
            }

            topology.name = jsPlumbUtil.uuid();
            topology.status = Topology.STATUS_SAVED;
            console.log(JSON.stringify(topology));


            $.ajax({
                type: "POST",
                url : "http://localhost:5000/api/topology/save",
                // url: "http://" + ip_domain + ":" + master_api_port +
                data: {"topology": JSON.stringify(topology)
                    // , "topoFile":jsPlumbUtil.uuid() + ".json"
                },
                dataType: "jsonp",
                crossDomain: true,
                success : function(data) {
//                    topology.status = Topology.STATUS_SAVED;
                    console.log(data);
                    var detailRow = "<a href='" + data["topology-url"] + "' class='easyui-linkbutton' data-options='iconCls:\"icon-save\"'>Detail</a>"
                    var deleteRow = "<a href='' class='easyui-linkbutton' data-options='iconCls:\"icon-save\"'>Delete</a>"
                    var topoRow = {
                        "topology-file": data["topology-file"],
                        "detail": detailRow,
                        "delete": deleteRow
                    }

                    $("#topology-datagrid").datagrid('insertRow', {index:0,row:topoRow});
                    currentTopoFile = data['topology-file'];
                    alert("Topology saved successfully!");
                },
                error: function(error){
                    console.log(error);
                    alert(error);
                }
            });

            // 保存拓扑的同时提交到后台
            $.ajax({
                type: 'POST',
                url: 'localhost:8080',
                data: {
                    "topology": JSON.stringify(topology),
                },
                success: function (data) {
                    console.log('success!')
                    console.log(data)
                },
                error: function (error) {
                    console.log(error)
                }
            })
        }
        else if(topology.status == Topology.STATUS_SAVED){
            alert("Nothing new to save. ");
            return;
        }
		
	});



    $("#delete-node").click(function(item){
        console.log(Visualizer.currentNode);
        var nodeType = Visualizer.currentNode.getAttribute('node-type');
        var nodeKey = Visualizer.currentNode.id;
        vis.deleteNodeByKey(nodeKey);
        topology.deleteNodeByKey(nodeKey);
        for(var k in components){
            var t = components[k];
            // Topology(t);
            t.deleteNodeByKey(nodeKey);
        }

        lists.removeEntityByKey(nodeType, nodeKey);

        showTopos();
    });

    // 右键edit配置窗体
    $("#edit-node").click(function () {
        // console.log("edit node clicked");
        // console.log(Visualizer.currentNode);
        $("#edit-window").window('open');
        let default_val = {
            id: Visualizer.currentNode.id,
            metrics: true,
            interval: 5
        };
        if ($("#edit-name").val() == this.defaultValue) {
            $("#edit-name").val("")
        }
        if ($("#edit-name").val() == "") {
            $("#edit-name").val(this.defaultValue)
        }
        $("#edit-name").text(Visualizer.currentNode.id);


        $("#edit-window .ok").click(function () {
            let new_name = $("#edit-name").val();
            let new_metrics = $("#edit-metrics").val();
            let new_interval = $("#edit-interval").val();
            // console.log(new_name + new_metrics + new_interval)
            // console.log(Visualizer.currentNode.getAttribute("node-type"))
            // console.log($(topology)[0].hosts[Visualizer.currentNode.id].configurations[1])
            if (Visualizer.currentNode.getAttribute("node-type") === "controller") {
                // $(topology)[0].controllers[Visualizer.currentNode.id].name = new_name;
                $(topology)[0].controllers[Visualizer.currentNode.id].configurations[0].config_value = new_metrics;
                $(topology)[0].controllers[Visualizer.currentNode.id].configurations[1].default_value = new_interval;
            } else if (Visualizer.currentNode.getAttribute("node-type") === "router") {
                // $(topology)[0].routers[Visualizer.currentNode.id].name = new_name;
                $(topology)[0].routers[Visualizer.currentNode.id].configurations[0].config_value = new_metrics;
                $(topology)[0].routers[Visualizer.currentNode.id].configurations[1].default_value = new_interval;
            } else if (Visualizer.currentNode.getAttribute("node-type") === "switche") {
                // $(topology)[0].switches[Visualizer.currentNode.id].name = new_name;
                $(topology)[0].switches[Visualizer.currentNode.id].configurations[0].config_value = new_metrics;
                $(topology)[0].switches[Visualizer.currentNode.id].configurations[1].default_value = new_interval;
            } else if (Visualizer.currentNode.getAttribute("node-type") === "host") {
                // $(topology)[0].hosts[Visualizer.currentNode.id].name = new_name;
                $(topology)[0].hosts[Visualizer.currentNode.id].configurations[0].config_value = new_metrics;
                $(topology)[0].hosts[Visualizer.currentNode.id].configurations[1].default_value = new_interval;
            } else if (Visualizer.currentNode.getAttribute("node-type") === "vnf") {
                // $(topology)[0].vnfs[Visualizer.currentNode.id].name = new_name;
                $(topology)[0].vnfs[Visualizer.currentNode.id].configurations[0].config_value = new_metrics;
                $(topology)[0].vnfs[Visualizer.currentNode.id].configurations[1].default_value = new_interval;
            } else if (Visualizer.currentNode.getAttribute("node-type") === "server"){
                // $(topology)[0].servers[Visualizer.currentNode.id].name = new_name;
                $(topology)[0].servers[Visualizer.currentNode.id].configurations[0].config_value = new_metrics;
                $(topology)[0].servers[Visualizer.currentNode.id].configurations[1].default_value = new_interval;
            }
            showTopos();

            $("#edit-window").window('close');
        });
        $("#edit-window .exit").click(function () {
            $("#edit-window").window('close')
        });
    });

    // config配置窗体
    $("#conf").click(function () {
        $("#config-window").window('open');
    });

    // program配置窗体
    $("#program").click(function () {
        $("#program-window").window('open');
        $("#program-window .ok").click(function () {
            if (Visualizer.currentNode.getAttribute("node-type") === "controller") {
                $(topology)[0].controllers[Visualizer.currentNode.id].program = {};
                $(topology)[0].controllers[Visualizer.currentNode.id].program['url'] = $("#program-url").val();
                $(topology)[0].controllers[Visualizer.currentNode.id].program['interval'] = $("#program-interval").val();
                $(topology)[0].controllers[Visualizer.currentNode.id].program['count'] = $("#program-count").val();
            } else if (Visualizer.currentNode.getAttribute("node-type") === "router") {
                $(topology)[0].routers[Visualizer.currentNode.id].program = {};
                $(topology)[0].routers[Visualizer.currentNode.id].program['url'] = $("#program-url").val();
                $(topology)[0].routers[Visualizer.currentNode.id].program['interval'] = $("#program-interval").val();
                $(topology)[0].routers[Visualizer.currentNode.id].program['count'] = $("#program-count").val();
            } else if (Visualizer.currentNode.getAttribute("node-type") === "switch") {
                $(topology)[0].switches[Visualizer.currentNode.id].program = {};
                $(topology)[0].switches[Visualizer.currentNode.id].program.url = $("#program-url").val();
                $(topology)[0].switches[Visualizer.currentNode.id].program.interval = $("#program-interval").val();
                $(topology)[0].switches[Visualizer.currentNode.id].count = $("#program-count").val();
            } else if (Visualizer.currentNode.getAttribute("node-type") === "host") {
                $(topology)[0].hosts[Visualizer.currentNode.id].program = {};
                $(topology)[0].hosts[Visualizer.currentNode.id].program.url = $("#program-url").val();
                $(topology)[0].hosts[Visualizer.currentNode.id].program.interval = $("#program-interval").val();
                $(topology)[0].hosts[Visualizer.currentNode.id].program.count = $("#program-count").val();
            } else if (Visualizer.currentNode.getAttribute("node-type") === "vnf") {
                $(topology)[0].vnfs[Visualizer.currentNode.id].program = {};
                $(topology)[0].vnfs[Visualizer.currentNode.id].program.url = $("#program-url").val();
                $(topology)[0].vnfs[Visualizer.currentNode.id].program.interval = $("#program-interval").val();
                $(topology)[0].vnfs[Visualizer.currentNode.id].program.count = $("#program-count").val();
            }else if (Visualizer.currentNode.getAttribute("node-type") === "server") {
                $(topology)[0].servers[Visualizer.currentNode.id].program = {};
                $(topology)[0].servers[Visualizer.currentNode.id].program.url = $("#program-url").val();
                $(topology)[0].servers[Visualizer.currentNode.id].program.interval = $("#program-interval").val();
                $(topology)[0].servers[Visualizer.currentNode.id].program.count = $("#program-count").val();
            }
            showTopos();
            $("#program-window").window('close');
        });
    });


    instance.bind("dblclick", function (c) {
        vis.deleteLink(c);
        for(var k in components){
            var t = components[k];
            // Topology(t);
            t.deleteLinkByKey(c.name);
        }
        showTopos();
    });



    // $(document).bind("hello",function(){
    //     // alert("hello world!");
    //     topology.status = "testing";
    //     console.log(topology);
    // });




    // $(".topology-preview").click(function(){
    //     // alert("preview");
    //     var row = $("#topology-datagrid").datagrid('getSelected');
    //     row = $("#topology-datagrid").datagrid('getSelected');
    //     console.log(row['topology-file']);
    // });

    $("#test").click(function () {
       $.ajax({
			type: "POST",
			url : "http://localhost:5000/deployment/test",
//			contentType: "application/json; charset=utf-8",
//            jsonp:"callback",
//            jsonCallback:"myfunc",
			data:{"key": "value",
                    "key51": "value51"
                    // , "topoFile":jsPlumbUtil.uuid() + ".json"
                },
	        // data: {"topoFile":currentTopoFile},
	        dataType: "jsonp",
	        crossDomain: true,
			success : function(data) {
                console.log(data)
                alert("Okay");
			},
			error: function(error){
			    console.log(error);
			    alert('Error!');
			}
		});
    });

    // $('#topology-show-data-window').window('open')
});
