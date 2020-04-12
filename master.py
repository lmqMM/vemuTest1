# coding=utf-8
from flask import Flask, request
import json

from deployment.topology_manager import TopologyManager
from utils.web_utils import unifiedResponse
from utils import address_utils
import threading
import subprocess
import requests

app = Flask(__name__)

f = open("config/master.json")
master_config = json.load(f)
f.close()

f = open("config/worker.json")
worker_config = json.load(f)
f.close()

workers = {}
topoFolder = "topo/"

mgr = TopologyManager()

@app.route('/')
def index():
    return "Welcome to the networking master! Please visit specific APIs. "

@app.route("/deployment/test", methods=['GET', 'POST'])
def test():
    # print(request)
    # callback = request.args.get("callback")
    print("testing...................................................................")

    k = request.args.get('key')
    print(k)
    dict = {
        "status": "OK",
        "message": "random content here"
    }
    msg = json.dumps(dict)
    resp = unifiedResponse(request, msg)
    print("returned message: ")
    print(resp)
    return resp


@app.route(master_config["register-worker-api"], methods=['GET', 'POST'])
def register():
    ip = request.args.get("ip")
    worker = request.args
    workers[ip] = worker

    keys = workers.keys()
    print("We have %s workers. Details are shown as below. " % len(keys))
    print(json.dumps(workers))

    result = {
        "status": "OK",
        "master-ip": address_utils.get_host_ip()
    }
    return result


@app.route(master_config["save-topology-api"], methods=['GET', 'POST'])
def saveTopology():

    callback = request.args.get("callback")
    topoStr = request.args.get("topology")
    # topoFile = request.args.get("topoFile")
    topo = json.loads(topoStr)
    topoFile = topo['name'] + ".json"

    mgr.saveTopology(topoFolder, topoFile, topoStr)

    serverProt = "http"
    serverIP = "127.0.0.1"
    serverPort = "5000"

    serverPath = serverProt + "://" + serverIP + ":" + serverPort

    topoDscptr = {
        "topology-file": topoFile,
        "topology-url": serverPath + "/" + topoFile,
        "topology-path": "topo.path"
    }

    topoDscptrStr = json.dumps(topoDscptr)
    myResponse = callback + '(' + topoDscptrStr + ')'
    print(myResponse)
    return myResponse

@app.route(master_config["bulk-deploy-application-api"], methods=['GET', 'POST'])
def bulk_deploy_application():
    # callback = request.args.get("callback")
    topoName = request.args.get("topology-name")
    appStr = request.args.get("application")
    app = json.loads(appStr)
    print(app)

    ips = workers.keys()

    for ip in ips:
        print("*************************** Deploying on the following worker machine: ")
        print(ip)
        print("***************************")

        url = 'http://%s:%s%s' % (ip, worker_config["api-port"], worker_config["deploy-application-api"])



        url = url + "?topology-name=" + topoName + "&application=" + appStr
        print(url)


        # response = requests.get(url=url, params='topology={"name":"topology666","switches":{},"hosts":{},"links":{},"controllers":{}}')
        response = requests.get(url=url)

        print(response.text)
        # resp = json.loads(response.text)
        # print(resp)


    myResponse = unifiedResponse(request, '{"status":"Application deployed successfully!"}')
    print(myResponse)
    return myResponse


@app.route(master_config["bulk-deploy-topology-api"], methods=['GET', 'POST'])
def bulk_deploy():
    topoStr = request.args.get("topology")

    # print("args: ", request.args)
    # print("topology: ", topoStr)

    topo = json.loads(topoStr)

    slices = {}

    ips = workers.keys()

    print(ips)

    for ip in ips:
        print("*************************** Deploying on the following worker machine: ")
        print(ip)
        print("***************************")
        slices[ip] = topo
        slices[ip]["status"] = "not deployed"
        url = 'http://%s:%s%s' % (ip, worker_config["api-port"], worker_config["deploy-topology-api"])

        # print(slices[ip])
        # slice = {
        #     "topology": slices[ip]
        # }
        # print(slice)
        # headers = {'Content-Type': 'application/json'}

        url = url + "?topology=" + json.dumps(slices[ip])


        # response = requests.get(url=url, params='topology={"name":"topology666","switches":{},"hosts":{},"links":{},"controllers":{}}')
        response = requests.get(url=url)

        print(response.text)
        resp = json.loads(response.text)
        print(resp)
        slices[ip]["status"] = resp["status"]

        print(slices)

        # print(url)
        # print(requests)
        # response = requests.get(url=url, params=slices[ip])

    myResponse = unifiedResponse(request, '{"status":"Topology deployed successfully!"}')
    print(myResponse)
    return myResponse

# def deploy


def launchAPI():
    print("Launching networking master with the following configuration: ")
    print(master_config)
    app.run(host="0.0.0.0", port=master_config["api-port"])

def launchGUI():
    print("Launching UI:")
    launch_gui = "python3 -m http.server %s" % master_config["gui-port"]
    subprocess.getstatusoutput(launch_gui)

def launchMonitor():
    pass

def launchRegistry():
    pass


if __name__ == '__main__':


    api_server = threading.Thread(target=launchAPI)
    api_server.start()


    gui_server = threading.Thread(target=launchGUI)
    gui_server.start()


    # time.sleep(15)
    # print("awake!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    #
    # f = open("topo/topo-ubuntu-net.json")
    # topo = json.load(f)
    # f.close()
    #
    # print(topo)
    #
    # bulk_deploy(topo)

