from flask import Flask, request
# from topomgr import *
# from flask import jsonify
# from ovs import OVSSwitch
# from container import DockerHost
from deployment.topology_manager import *
from utils.web_utils import unifiedResponse
import json

app = Flask(__name__)

serverProt = "http"
serverIP = "127.0.0.1"
serverPort = "5000"

serverPath = serverProt + "://" + serverIP + ":" + serverPort

topoFolder = "../topo/"

mgr = TopologyManager()


f = open("config/worker.json")
worker_config = json.load(f)
f.close()


@app.route('/')
def index():
    return "Welcome to the deployment worker! Please visit specific APIs. "

@app.route('/api/topology/deploy', methods=['GET', 'POST'])
def deployToplogy():
    # callback = request.args.get("callback")
    topoStr = request.args.get("topology")

    # print("args: ", request.args)
    # print("topology: ", topoStr)

    topo = json.loads(topoStr)

    mgr.deployTopology(topo)

    # myResponse = callback + '({status:"Topology deployed successfully!"})'
    myResponse = unifiedResponse(request, '{"status":"deployed"}')
    print(myResponse)
    return myResponse

@app.route('/api/topology/undeploy', methods=['GET', 'POST'])
def destroyTopology():
    callback = request.args.get("callback")
    topoName = request.args.get("topology-name")

    mgr.destroyTopology(topoName)
    myResponse = callback + '({status:"Topology undeployed successfully!"})'
    print(myResponse)
    return myResponse



@app.route('/api/topology/save', methods=['GET', 'POST'])
def saveTopology():

    callback = request.args.get("callback")
    topoStr = request.args.get("topology")
    # topoFile = request.args.get("topoFile")
    topo = json.loads(topoStr)
    topoFile = topo['name'] + ".json"

    mgr.saveTopology(topoFolder, topoFile, topoStr)

    topoDscptr = {
        "topology-file": topoFile,
        "topology-url": serverPath + "/" + topoFile,
        "topology-path": "topo.path"
    }

    topoDscptrStr = json.dumps(topoDscptr)
    myResponse = callback + '(' + topoDscptrStr + ')'
    print(myResponse)
    return myResponse

@app.route('/api/application/deploy', methods=['GET', 'POST'])
def deployApplication():
    # callback = request.args.get("callback")
    topoName = request.args.get("topology-name")
    appStr = request.args.get("application")
    app = json.loads(appStr)
    print(app)

    mgr.deployApplication(topoName, app)
    # myResponse = callback + '({status:"Application deployed successfully!"})'
    myResponse = unifiedResponse(request, '{status:"Application deployed successfully!}')
    print(myResponse)
    return myResponse

def launchDeployer():
    app.run(host="0.0.0.0", port=worker_config["api-port"])

if __name__ == '__main__':
    # app.run()
    app.run(host="0.0.0.0", port=worker_config["api-port"])
