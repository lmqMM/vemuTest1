const Controller = function (controllerType, ip, port, x, y) {
    Controller.total++;

    this.name = "c" + Controller.total;
    this.nodeType = "controller";
    this.controllerType = controllerType;
    this.subType = controllerType;
    this.ip = ip;
    this.port = port;
    this.x = x;
    this.y = y;
    // this.image =
}

const Switch = function (switchType, ofProtocol, x, y) {
    Switch.total++;

    this.name = "s" + Switch.total;
    this.nodeType = "switch";
    this.switchType = switchType;
    this.subType = switchType;
    this.ofProtocol = ofProtocol;
    this.x = x;
    this.y = y;

    this.setPosition = function(x, y){
        this.x = x;
        this.y = y;
    }
}

const Router = function (routerType, x, y) {
    Router.total++;

    this.name = routerType + Router.total;
    this.nodeType = "router";
    this.routerType = routerType;
    this.subType = routerType;
    // this.ipList = [];
    this.x = x;
    this.y = y;

    this.setPosition = function(x, y){
        this.x = x;
        this.y = y;
    }
}

const VNF = function (vnfType, x, y) {
    VNF.total++;

    this.name = vnfType + VNF.total;
    this.nodeType = "vnf";
    this.vnfType = vnfType;
    this.subType = vnfType;

    this.x = x;
    this.y = y;

    this.setPosition = function(x, y){
        this.x = x;
        this.y = y;
    }
}

const Host = function (hostType, ip, x, y) {
    Host.total++;

    this.name = "h" + Host.total;
    this.nodeType = "host";
    this.hostType = hostType;
    this.subType = hostType;
    this.ip = ip;
    this.x = x;
    this.y = y;

    this.setPosition = function(x, y){
        this.x = x;
        this.y = y;
    }
}

const Link = function (sourceNode, targetNode) {
    Link.total++;
    console.log("Link class " + Link.total);

    this.name = "l" + Link.total;

    this.source = sourceNode.name;
    this.sourceType = sourceNode.nodeType;
    this.target = targetNode.name;
    this.targetType = targetNode.nodeType;
}

const Link2 = function (source, target, sourceType, targetType) {
    Link.total++;
    console.log("Link2 class " + Link.total);

    this.name = "l" + Link.total;

    this.source = source;
    this.sourceType = sourceType;
    this.target = target;
    this.targetType = targetType;
}

const WebApplication = function (name, description, appType) {
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