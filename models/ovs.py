import subprocess


class OVSSwitch():
    name = ''

    # def __init__(self):
    #     self.name = uuidStr()
    #     (status, output) = commands.getstatusoutput('sudo ovs-vsctl add-br ' + self.name)

    def __init__(self, swName):
        self.name = swName
        subprocess.getstatusoutput('sudo ovs-vsctl add-br ' + self.name)


    def setController(self, controllerIP, controllerPort):
        controllerCmd = 'sudo ovs-vsctl set-controller ' + self.name + ' tcp:' + controllerIP + ':' + controllerPort
        subprocess.getstatusoutput(controllerCmd)

    def dhcpSetup(self, dhcpServerIP, startIP, endIP, mask):
        dhcpPort = self.name + "-dhcp"
        subprocess.getstatusoutput('sudo ovs-vsctl add-port ' + self.name + ' ' + dhcpPort)
        subprocess.getstatusoutput('sudo ovs-vsctl set Interface ' + dhcpPort + ' type=internal')
        subprocess.getstatusoutput('sudo ifconfig ' + dhcpPort + ' ' + dhcpServerIP)
        dhcpCmd = 'sudo /usr/sbin/dnsmasq --strict-order --bind-interfaces --interface=' + dhcpPort + ' --except-interface=lo --pid-file=/var/run/dnsmasq/' + dhcpPort + '.pid --leasefile-ro --dhcp-range=' + startIP + ',' + endIP + ',' + mask + ',12h --conf-file='
        subprocess.getstatusoutput(dhcpCmd)

    def destroy(self):
        subprocess.getstatusoutput('sudo ovs-vsctl del-br ' + self.name)


    def connect(self, sw):

        print(('connecting ' + self.name + ' ' + sw.name))

        fromMeToYou = self.name + sw.name
        fromYouToMe = sw.name + self.name

        subprocess.getstatusoutput('sudo ovs-vsctl add-port ' + self.name + ' ' + fromMeToYou)
        subprocess.getstatusoutput('sudo ovs-vsctl set Interface ' + fromMeToYou + ' type=patch')
        subprocess.getstatusoutput('sudo ovs-vsctl set Interface ' + fromMeToYou + ' options:peer=' + fromYouToMe)

        subprocess.getstatusoutput('sudo ovs-vsctl add-port ' + sw.name + ' ' + fromYouToMe)
        subprocess.getstatusoutput('sudo ovs-vsctl set Interface ' + fromYouToMe + ' type=patch')
        subprocess.getstatusoutput('sudo ovs-vsctl set Interface ' + fromYouToMe + ' options:peer=' + fromMeToYou)

    def connectContainer(self, host, hostIP):
        x = subprocess.getstatusoutput('pwd')
        print(x)
        print(('connecting ' + self.name + ' ' + host.name))
        x = subprocess.getstatusoutput('sudo ./ovs-docker add-port ' + self.name + ' eth0 ' + host.name + ' --ipaddress=' + hostIP)
        print(x)






