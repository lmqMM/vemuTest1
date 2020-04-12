function searchlist(node){
        //$('#node-datagrid').datagrid('deleteRow', {index:0,row:node});
        $('#node-datagrid').datagrid('insertRow', {index:0,row:node});
        //$('#ssw-datagrid').datagrid('insertRow', {index:0,row:sw});
};

function searchHost(hosttopo,hostname) {
	this.datakey = [];
	this.hosttopo = hosttopo;
	this.hostname = hostname;

	datakey = Object.keys(hosttopo);
	
	var flag = datakey.indexOf(hostname);
	if (flag != -1)
		return hosttopo[hostname];
	else
		return -1;
}

function searchSwitch(switchtopo,switchname) {
	this.datakey = [];
	this.switchtopo = switchtopo;
	this.switchname = switchname;
	
	datakey = Object.keys(switchtopo);

	var flag = datakey.indexOf(switchname);
	if (flag != -1)
		return switchtopo[switchname];
	else
		return -1;
}

function searchController(controllertopo,controllername) {
	this.datakey = [];
	this.controllertopo = controllertopo;
	this.controllername = controllername;
	
	datakey = Object.keys(controllertopo);

	var flag = datakey.indexOf(controllername);
	if (flag != -1)
		return controllertopo[controllername];
	else
		return -1;
}

function searchvnf(vnftopo,vnfname) {
	this.datakey = [];
	this.vnftopo = vnftopo;
	this.vnfname = vnfname;
	
	datakey = Object.keys(vnftopo);

	var flag = datakey.indexOf(vnfname);
	if (flag != -1)
		return vnftopo[vnfname];
	else
		return -1;
}

function searchrouter(routertopo,routername) {
	this.datakey = [];
	this.routertopo = routertopo;
	this.routername = routername;
	
	datakey = Object.keys(routertopo);

	var flag = datakey.indexOf(routername);
	if (flag != -1)
		return routertopo[routername];
	else
		return -1;
}

function Search(nodename) {
	this.nodename = nodename;
	this.nodeinformation = null;

	//console.log(nodename);
	//var test;
	//test = nodename.substr(0, nodename.length - 1);
	//console.log(test);
	var nodename_information = null;
	nodename_information = nodename.substr(0, nodename.length - 1);
	//console.log(nodename_information);

	if (nodename_information == 'apache' || nodename_information == 'nginx' || nodename_information == 'firewall' || nodename_information == 'dns' || nodename_information == 'dhcp') {
		//console.log('test');
		nodeinformation = searchvnf(topology.vnfs,nodename);
		if (nodeinformation != -1) {
			//console.log(topology.name);
			//console.log(nodeinformation);
			return nodeinformation;
		}
		else if (nodeinformation == -1) {
			for (var key in components){
			
				nodeinformation = searchvnf(components[key].vnfs,nodename);
				if (nodeinformation != -1){
					//console.log(key);
					//console.log(nodeinformation);
					return nodeinformation;
					break;
				}
				else{
					continue;
				}
			}
		}
	}
	if (nodename_information == 'quagga') {
		nodeinformation = searchrouter(topology.routers,nodename);
		if (nodeinformation != -1) {
			//console.log(topology.name);
			//console.log(nodeinformation);
			return nodeinformation;
		}
		else if (nodeinformation == -1) {
			for (var key in components){
			
				nodeinformation = searchrouter(components[key].routers,nodename);
				if (nodeinformation != -1){
					//console.log(key);
					//console.log(nodeinformation);
					return nodeinformation;
					break;
				}
				else{
					continue;
				}
			}
		}
	}

	var firstletter = nodename.substr(0,1);

	if (firstletter == 'h') {
		nodeinformation = searchHost(topology.hosts,nodename);
		if (nodeinformation != -1) {
			//console.log(topology.name);
			//console.log(nodeinformation);
			return nodeinformation;
		}
		else if (nodeinformation == -1) {
			for (var key in components){
			
				nodeinformation = searchHost(components[key].hosts,nodename);
				if (nodeinformation != -1){
					//console.log(key);
					//console.log(nodeinformation);
					return nodeinformation;
					break;
				}
				else{
					continue;
				}
			}
		}
	}

	if (firstletter == 's') {
		nodeinformation = searchSwitch(topology.switches,nodename);
		if (nodeinformation != -1) {
			//console.log(topology.name);
			//console.log(nodeinformation);
			return nodeinformation;
		}
		else if (nodeinformation == -1) {
			for (var key in components){
			
				var nodeinformation = searchHost(components[key].switches,nodename);
				if (nodeinformation != -1){
					//console.log(key);
					//console.log(nodeinformation);
					return nodeinformation;
					break;
				}
				else{
					continue;
				}
			}
		}
	}

	if (firstletter == 'c') {
		nodeinformation = searchController(topology.controllers,nodename);
		if (nodeinformation != -1) {
			//console.log(topology.name);
			//console.log(nodeinformation);
			return nodeinformation;
		}
		else if (nodeinformation == -1) {
			for (var key in components){
			
				var nodeinformation = searchController(components[key].controllers,nodename);
				if (nodeinformation != -1){
					//console.log(key);
					//console.log(nodeinformation);
					return nodeinformation;
					break;
				}
				else{
					continue;
				}
			}
		}
	}

}

function Searchevent() {
	var shownode = {
		"name":null,
		"type":null,
		"data":null

	};
	this.nodeinformation = null;
	this.nodename = document.getElementById("getname").value;
	this.firstletter = nodename.substr(0,1);

	if (firstletter == 'h') {
		nodeinformation = Search(nodename);
		shownode.name = nodeinformation.name;
		shownode.type = nodeinformation.hostType;
		shownode.data = nodeinformation.ip;
		searchlist(shownode);
	}

	if (firstletter == 's') {
		nodeinformation = Search(nodename);
		shownode.name = nodeinformation.name;
		shownode.type = nodeinformation.switchType;
		var ovsversion = "Openflow" + nodeinformation.ofProtocol;
		shownode.data = ovsversion;
		searchlist(shownode);
	}
	if (firstletter == 'c') {
		nodeinformation = Search(nodename);
		shownode.name = nodeinformation.name;
		shownode.type = nodeinformation.controllerType;
		cdata = "ip:" + nodeinformation.ip + "port:" + nodeinformation.port;
		shownode.data = cdata;
		searchlist(shownode);
	}
}