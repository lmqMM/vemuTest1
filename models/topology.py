#!/usr/bin/env python2
import docker
from models.ovs import OVSSwitch


class Topology():

    name = None

    switchDict = {}
    hostDict = {}
    linkDict = {}
    controllerDict = {}


    def __init__(self, name, topo):

        client = docker.from_env()

        self.name = name

        print(("ContainerSDN: " + self.name))

        switches = topo['switches']
        hosts = topo['hosts']
        links = topo['links']
        controllers = topo['controllers']

        print(links)

        # openflowPort = util.get_free_port()
        # webPort = util.get_free_port()
        #
        # print(openflowPort)
        # print(webPort)
        #
        # controller = client.containers.run(
        #     image='glefevre/floodlight',
        #     name=util.uuidStr(),
        #     # ports={'8080': webPort, '6653': openflowPort},
        #     ports={'8080': '8080', '6653': '6653'},
        #     detach=True
        # )
        #
        # print("about the controller ... ")
        # print(controller)
        # print(controller.attrs)




        # for key in controllers:
        #     pass

        for key in switches:
            sw = OVSSwitch(key)
            sw.setController('127.0.0.1', '6653')
            self.switchDict[key] = sw

        pos = 0
        pingIP = ''
        print("***********************************************")

        for key in hosts:
            print((hosts[key]))

            if pos == 0:
                pingCIDR = hosts[key]['ip']
                pingIP = pingCIDR.split('/')[0]
                pos = 1

            container = client.containers.create(image=hosts[key]['image'], name=key,
                                              command="/bin/bash",
                                              cpuset_cpus="0,1",
                                              cpu_shares=2,
                                              cpu_period=100000,
                                              mem_limit="512m",
                                              network_mode="none",
                                              user="root",
                                              detach=True,
                                              tty=True,
                                              stdin_open=True,
                                              hostname="topostack",
                                              oom_kill_disable=True,
                                              publish_all_ports=True,
                                              privileged=True
                                              )

            container.start()
            print((container.__class__))
            self.hostDict[key] = container

        for key in links:
            link = links[key]
            source = link['source']
            target = link['target']
            sourceType = link['sourceType']
            targetType = link['targetType']

            print((source, target))

            if sourceType == 'switch' and targetType == 'switch':
                sourceSW = self.switchDict[source]
                targetSW = self.switchDict[target]
                sourceSW.connect(targetSW)

            elif sourceType == 'switch' and targetType == 'host':
                sourceSW = self.switchDict[source]
                targetHost = self.hostDict[target]
                targetHostIP = hosts[target]['ip']
                sourceSW.connectContainer(targetHost, targetHostIP)

            elif sourceType == 'host' and targetType == 'switch':
                sourceHost = self.hostDict[source]
                targetSW = self.switchDict[target]
                sourceHostIP = hosts[source]['ip']
                targetSW.connectContainer(sourceHost, sourceHostIP)

        for key in self.hostDict:
            container = self.hostDict[key]
            command = '/bin/bash launch.sh ' + pingIP
            print(command)
            container.exec_run(command, detach=True)

    def destroy(self):
        print('self desctructing...')

        for key in self.hostDict:
            container = self.hostDict[key]
            container.stop()
            container.remove()

        for key in self.switchDict:
            sw = self.switchDict[key]
            sw.destroy()

    def runApp(self, app):
        print('running app')
        if app['type'] == 'web-app':
            self.webApp(app)

        elif app['type'] == 'video-app':
            pass

        elif app['type'] == 'sfc-app':
            pass

        elif app['type'] == 'ai-app':
            pass

    def webApp(self, app):
        serverScript = app['serverScript']
        if 'serverParams' in app:
            for param in app['serverParams']:
                paramName = param['paramName']
                paramValue = param['paramValue']
                serverScript = serverScript + " --" + paramName + "=" + paramValue
        print(serverScript)

        clientScript = app['clientScript']
        if 'clientParams' in app:
            for param in app['clientParams']:
                paramName = param['paramName']
                paramValue = param['paramValue']
                clientScript = clientScript + " --" + paramName + "=" + paramValue
        print(clientScript)

        for serverKey in app['servers']:
            print(serverKey)
            server = self.hostDict[serverKey]
            server.exec_run(serverScript, detach=True)

        for clientKey in app['clients']:
            print(clientKey)
            client = self.hostDict[clientKey]
            print(client)
            print((client == None))
            x = client.exec_run(clientScript, detach=True)
            # command = '/bin/bash -c "while true; do echo 123456789; sleep 1; done"'
            # x = client.exec_run(command, detach=True)
            print(x)

    def videoApp(self, app):
        pass

    def sfcApp(self, app):
        pass

    def aiApp(self, app):
        pass


if __name__ == '__main__':
    print('hello')
