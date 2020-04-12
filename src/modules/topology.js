const Topology = function () {
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
    // this.name = name;
    this.status = Topology.STATUS_CREATED;
    this.controllers = {};
    this.switches = {};
    this.hosts = {};
    this.vnfs = {};
    this.routers = {};
    this.links = {};
}
// module.exports = Topology