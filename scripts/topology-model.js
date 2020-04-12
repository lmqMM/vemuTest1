/*该脚本定义了网络设备的抽象模型，不与任何特定编程技术做绑定，具有良好的可移植性。由于使用了JavaScript语言，因此，可以方便地序列化为JSON，便于在前后端系统之间传递数据*/




function Controller(controllerType, ip, port, x, y){
    Controller.total++;

    this.name = "c" + Controller.total;
    this.nodeType = "controller";
    this.controllerType = controllerType;
    this.subType = controllerType;
    this.ip = ip;
    this.port = port;
    this.x = x;
    this.y = y;
    this.interfaces = [];
    this.configurations = [
        {
            config_name: "record_metrics",
            config_value: true
        },
        {
            config_name: "record_interval",
            default_value: 5
        }
    ];
}



function Switch(switchType,host, x, y) {
    Switch.total++;
    this.name = "s" + Switch.total;
    this.nodeType = "switch";
    this.switchType = switchType;
    this.subType = switchType;
    //this.ofProtocol = ofProtocol;
    this.host = host;
    this.x = x;
    this.y = y;
    this.interfaces = [];
    this.configurations = [
        {
            config_name: "record_metrics",
            config_value: true
        },
        {
            config_name: "record_interval",
            default_value: 5
        }
    ];
}

function SwitchHost(qos) {
    this.qos = qos;
}

// function SwitchIn(intname) {
//     this.intname = intname;
// }

function Router(routerType, x, y){
    Router.total++;

    this.name = routerType + Router.total;
    this.nodeType = "router";
    this.routerType = routerType;
    this.subType = routerType;
    // this.ipList = [];
    this.x = x;
    this.y = y;
    this.interfaces = [];
    this.configurations = [
        {
            config_name: "record_metrics",
            config_value: true
        },
        {
            config_name: "record_interval",
            default_value: 5
        }
    ];
    this.setPosition = function(x, y){
       this.x = x;
       this.y = y;
    }
}

function VNF(vnfType, x, y){
    VNF.total++;

    this.name = vnfType + VNF.total;
    this.nodeType = "vnf";
    this.vnfType = vnfType;
    this.subType = vnfType;
    this.interfaces = [];
    this.configurations = [
        {
            config_name: "record_metrics",
            config_value: true
        },
        {
            config_name: "record_interval",
            default_value: 5
        }
    ];
    this.x = x;
    this.y = y;

    this.setPosition = function(x, y){
       this.x = x;
       this.y = y;
    }

}

function VNFIn(name,ip,netmask) {
    this.name = name;
    //this.name = sourceId+targetId;
    this.ip = ip;
    this.netmask = netmask;
}

function SERVER(serverType, x, y){
    SERVER.total++;

    this.name = serverType + SERVER.total;
    this.nodeType = "server";
    this.serverType = serverType;
    this.subType = serverType;

    this.x = x;
    this.y = y;

    this.setPosition = function(x, y){
       this.x = x;
       this.y = y;
    }

}

function SERVERIn(name,ip,netmask) {
    this.name = name;
    //this.name = sourceId+targetId;
    this.ip = ip;
    this.netmask = netmask;
}


function HostIn(name,ip,netmask) {
    this.name = name;
    //this.name = sourceId+targetId;
    this.ip = ip;
    this.netmask = netmask;
}

function HostCon(config_name) {
    this.config_name = config_name;
}


function Host(hostType, ip, x, y,virtualization){
    Host.total++;

    this.name = "h" + Host.total;
    this.nodeType = "host";
    this.hostType = hostType;
    this.subType = hostType;
    this.virtualization = virtualization;
    this.interfaces = [];
    this.configurations = [
        {
            config_name: "record_metrics",
            config_value: true
        },
        {
            config_name: "record_interval",
            default_value: 5
        }
    ];
    this.ip = ip;
    this.x = x;
    this.y = y;

    this.setPosition = function(x, y){
        this.x = x;
        this.y = y;
    }

}





function Link(sourceNode, targetNode){
    Link.total++;
    console.log("Link class " + Link.total);

    this.name = "l" + Link.total;

    this.source = sourceNode.name;
    this.sourceType = sourceNode.nodeType;
    this.target = targetNode.name;
    this.targetType = targetNode.nodeType;
}

function Link2(source, target, sourceType, targetType){
    Link.total++;
    console.log("Link2 class " + Link.total);

    this.name = "l" + Link.total;

    this.source = source;
    this.sourceType = sourceType;
    this.target = target;
    this.targetType = targetType;
    this.delay = '';
    this.jitter = '';
    this.max_bandwidth = '';
    this.burst = '';
    this.latency = '';
}



function Topology(){

    Topology.total++;


    Topology.STATUS_INIT = "STATUS_INIT";
    Topology.STATUS_CREATED = "STATUS_CREATED";       //新建的拓扑结构，无节点、无链路
    Topology.STATUS_MODIFIED = "STATUS_MODIFIED";      //修改过的拓扑结构
    Topology.STATUS_SAVED = "STATUS_SAVED";         //以保存过的拓扑结构
    Topology.STATUS_MERGED = "STATUS_MERGED";        //已合并的拓扑结构
    Topology.STATUS_DEPLOYED = "STATUS_DEPLOYED";      //已部署的拓扑结构
    Topology.STATUS_UNDEPLOYED = "STATUS_UNDEPLOYED";    //已撤销部署的拓扑结构
    Topology.STATUS_CLEARED = "STATUS_CLEARED";
    Topology.STATUS_LOADED = "STATUS_LOADED";

    Topology.EVENT_MODIFY = "EVENT_MODIFY";
    Topology.EVENT_NEW_TOPOLOGY = "EVENT_NEW_TOPOLOGY";
    Topology.EVENT_LOAD_TOPOLOGY = "EVENT_LOAD_TOPOLOGY";
    Topology.EVENT_SAVE_TOPOLOGY = "EVENT_SAVE_TOPOLOGY";
    Topology.EVENT_DEPLOY_TOPOLOGY = "EVENT_DEPLOY_TOPOLOGY";
    Topology.EVENT_SAVE_CHANGES = "EVENT_SAVE_CHANGES";
    Topology.EVENT_DEPLOY_CHANGES = "EVENT_DEPLOY_CHANGES";
    Topology.EVENT_DELETE_TOPOLOGY = "EVENT_DELETE_TOPOLOGY";
    Topology.EVENT_UNDEPLOY_TOPOLOGY = "EVENT_UNDEPLOY_TOPOLOGY";

//    this.name = jsPlumbUtil.uuid();
    this.name = "topology" + Topology.total;
//     this.name = "topology";
    this.status = Topology.STATUS_CREATED;
    this.controllers = {};
    this.switches = {};
    this.hosts = {};
    this.vnfs = {};
    this.servers={};
    this.routers = {};
    this.links = {};

    this.load = function(topoFile){
        this.status = Topology.STATUS_LOADED;
    }

    this.addVnf = function(vnf){
        this.vnfs[vnf.name] = vnf;
        this.status = Topology.STATUS_MODIFIED;

        //在实体栏添加vnf节点
        var entitiesID = vnf.name;
        var entitiesType = vnf.vnfType;
        entitiesAppend(entitiesType,entitiesID);
    }
    this.addServer = function(server){
        this.servers[server.name] = server;
        this.status = Topology.STATUS_MODIFIED;
        //在实体栏添加vnf节点
        var entitiesID = server.name;
        var entitiesType = server.serverType;
        entitiesAppend(entitiesType,entitiesID);
    }



    this.addController = function(ctlr){
        this.controllers[ctlr.name] = ctlr;
        this.status = Topology.STATUS_MODIFIED;

        //在实体栏添加controller节点
        var entitiesID = ctlr.name;
        var entitiesType = ctlr.controllerType;
        entitiesAppend(entitiesType,entitiesID);
    }

    this.addSwitch = function(sw){
        this.switches[sw.name] = sw;
        this.status = Topology.STATUS_MODIFIED;

        //在实体栏添加controller节点
        var entitiesID = sw.name;
        var entitiesType = sw.switchType;
        entitiesAppend(entitiesType,entitiesID);
    }

    this.addHost = function(host){
        this.hosts[host.name] = host;
        this.status = Topology.STATUS_MODIFIED;

        //在实体栏添加host节点
        var entitiesID = host.name;
        var entitiesType = host.hostType;
        entitiesAppend(entitiesType,entitiesID);
    }

    this.addRouter = function(router){
        this.routers[router.name] = router;
        this.status = Topology.STATUS_MODIFIED;

        //在实体栏添加router节点
        var entitiesID = router.name;
        var entitiesType = router.routerType;
        entitiesAppend(entitiesType,entitiesID);
    }

    this.addLink = function(link){
        this.links[link.name] = link;
        this.status = Topology.STATUS_MODIFIED;
    }

    this.merge = function(part){
        $.extend(this.switches, part.switches);
        $.extend(this.hosts, part.hosts);
        $.extend(this.links, part.links);
        part.status = Topology.STATUS_MERGED;
        this.status = Topology.STATUS_MODIFIED;
    }

    this.clear = function(){
        this.controllers = {};
        this.switches = {};
        this.hosts = {};
        this.links = {};
        this.status = Topology.STATUS_CLEARED;
    }

    this.getSwitch = function(key){
        return this.switches[key];
    }

    this.getHost = function(key){
        return this.hosts[key];
    }

    this.getController = function(key){
        return this.controllers[key];
    }

    this.getLink = function(key){
        return this.links[key];
    }

    this.deleteNodeByKey = function(key){

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

    }

    this.deleteLinkByKey = function(key){
        delete this.links[key];
        this.status = Topology.STATUS_MODIFIED;
    }
}

function WebApplication(name, description, appType){

    this.name = name;
    this.description = description;
    this.type = appType;

    this.servers = [];
    this.serverType = "independent";
    this.serverScript = "python -m SimpleHTTPServer 80";
    this.serverParams = [];

    this.clients = [];
    this.clientType = "independent";
    this.clientScript = "python web-app-python-client.py";
    this.clientParams = [];
}


