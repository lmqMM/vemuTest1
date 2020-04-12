function entitiesEdit() {
	entitiesAppend();
}

function entitiesEdit(nodeid) {
	$('#edit-window').window('open');
	var nodeid = nodeid.getAttribute('date-nodeid');
	editWindow(nodeid);
	//console.log(nodeid);

}

function entitySearch(){
	this.appendsearchentity = null;
	this.entityID = null;
	this.searchReturn = null;
	this.entityType = null;

	//获取输入栏输入
	entityID = document.getElementById('getinput').value;
	//console.log(entityID);
	if (entityID.length > 0) {
		searchReturn = Search(entityID);
		console.log(searchReturn);

		if (searchReturn == null){
			appendsearchentity = 
			"<div id = 'entity-temporary'><div align='center'>该节点不存在</div></div>"
		}
		else{

			//switch节点搞特殊
			if (nodename.substr(0,1) == 's') {
				//console.log('test');
				entityType = searchReturn.switchType;
			}

			else 
			{
				if (searchReturn.nodeType == 'host')
				{
					entityType = searchReturn.hostType;
				}
				else if (searchReturn.nodeType == 'controller')
				{
					entityType = searchReturn.controllerType;
				}
				else if (searchReturn.nodeType == 'vnf')
				{
					entityType = searchReturn.vnfType;
				}
				else if (searchReturn.nodeType == 'router')
				{
					entityType = searchReturn.routerType;
				}
			}

			//entityType = searchReturn.nodeType;

			//entitiesAppend(entityType,entityID);

			//console.log(searchReturn);
			appendsearchentity = 
			"<div id = 'entity-temporary'><div style='margin:5px 0;'></div><div id='entities-"+
			entityID +"' class='entities'><div class='entities-img-"+ 
			entityType +"'></div><div class='entities-edit' onclick='entitiesEdit(this)'date-nodeid='"+ 
			entityID +"'></div>" + "<div class='entities-name'>"+ 
			entityID +"</div><div class='entities-delete' onclick='entitiesDelete()'></div></div>"+
			"<div style='margin:5px 0;'></div></div>"
		
		}
	}
	else {
		appendsearchentity = 
		"<div id = 'entity-temporary'><div align='center'>请输入数值</div></div>"
	}

	//console.log(test);
	$('#entity-temporary').remove();
	$('#entity-search').append(appendsearchentity);

}

function entitiesAppend(entitiesType,entitiesID) {
	this.appendentity;
	this.entitiesType = entitiesType;
	this.entitiesID =entitiesID;

	this.appendmodel_1;
	this.appendmodel_img;
	this.appendmodel_edit;
	this.appendmodel_delete;
	this.appendmodel_name;

	//if (entitiesType == 'switches') {
	//	entitiesType = 'switch'
	//}

	//各种实体的模块
	appendmodel_1 = "<div style='margin:5px 0;'></div>";
	appendmodel_img = "<div class='entities-img-"+ entitiesType +"'></div>";
	appendmodel_edit = "<div class='entities-edit' onclick='entitiesEdit(this)'date-nodeid='"+ entitiesID +"'></div>";
	appendmodel_delete = "<div class='entities-delete' onclick='entitiesDelete()'></div>";
	appendmodel_name = "<div class='entities-name'>"+ entitiesID +"</div>";

	//各类模块组合
	appendentity = 
	appendmodel_1 + "<div id='entities-"+
	entitiesID +"' class='entities'>"+ 
	appendmodel_img + appendmodel_edit + appendmodel_name + 
	appendmodel_delete +"</div>";

	$('#entities-tool').append(appendentity);
	// console.log(entitiesType,entitiesID);
}

function entityStatus () {}