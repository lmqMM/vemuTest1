# coding=utf-8
import socket
import netifaces
import uuid

# from utils.util import SO_BINDTODEVICE
SO_BINDTODEVICE = 25

def get_mac_address():
    mac=uuid.UUID(int = uuid.getnode()).hex[-12:]
    return ":".join([mac[e:e+2] for e in range(0,11,2)])




def get_broadcast_address(ip):
    broadcast = ""
    net = netifaces.interfaces()

    for eth in net:

        addrs = netifaces.ifaddresses(eth)

        try:

            detials = addrs[netifaces.AF_INET]

            for detial in detials:

                if str(detial["addr"]) == ip:

                    broadcast = detial["broadcast"]

                    break

        except:

            pass

    return broadcast





def get_host_ip():

    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    s.connect(('114.114.114.114', 80))

    local_ip = s.getsockname()[0]

    return local_ip





def main():

    host_ip = get_host_ip()

    print("ip地址是:" + host_ip)

    broadcast_address = get_broadcast_address(host_ip)

    print("广播地址是:" + broadcast_address)

    return broadcast_address





if __name__ == '__main__':

    broadcast_address = main()


def get_free_port(iface=None):
    s = socket.socket()

    if iface:
        s.setsockopt(socket.SOL_SOCKET, SO_BINDTODEVICE, bytes(iface, 'utf8'))

    s.bind(('', 0))
    port = s.getsockname()[1]
    s.close()

    return port