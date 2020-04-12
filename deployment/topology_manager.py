import json
import time
import sys
sys.path.append('../')
from models.topology import Topology

class TopologyManager():

    topoDict = {}

    def __init__(self):
        print("topology manager")

    def saveTopology(self, topoFolder, topoFile, topoStr):
        f = open(topoFolder + topoFile, 'w')
        f.write(topoStr)
        f.close()

    def deployTopology(self, topo):
        net = Topology(topo['name'], topo)
        self.topoDict[net.name] = net

        print('-----------------------------------------------')
        for item in self.topoDict:
            print(item)

        return net


    def deployTopologyOld(self, topoFolder, topoFile):

        f = open(topoFolder + topoFile, 'r')
        topoStr = f.read()
        f.close()
        topo = json.loads(topoStr)
        print(topoStr)



        print("topoFile as name: " + topoFile)
        net = Topology(topoFile, topo)
        self.topoDict[net.name] = net

        print('-----------------------------------------------')
        for item in self.topoDict:
            print(item)

        return net

    def destroyTopology(self, topoName):
        print("destoying " + topoName)
        net = self.topoDict[topoName]
        net.destroy()

    def deployApplication(self, topoName, app):
        # print("deploying app on " + topoName)
        # net = self.topoDict[topoName]
        #
        # f = open(appFolder + appFile, 'r')
        # appStr = f.read()
        # f.close()
        # app = json.loads(appStr)
        # print(appStr)

        net = self.topoDict[topoName]
        net.runApp(app)









if __name__ == '__main__':
    mgr = TopologyManager()
    net = mgr.deployTopology('../topo', '/topo-x.json')

    time.sleep(20)# wait for node discovery before application starts

    f = open('../apps' + '/sample-web-app.json', 'r')
    appStr = f.read()
    f.close()
    app = json.loads(appStr)
    print(app)
    net.runApp(app)
    # time.sleep(10)
    # mgr.destroyTopology(net.name)