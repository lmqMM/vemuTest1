# coding=utf-8
import docker
# import util
import time
import subprocess
import json

# 如下测试代码，用于获取container的各项属性
from utils.address_utils import get_free_port
from utils.web_utils import uuidStr

if __name__ == '__main__':
    print((get_free_port()))



    client = docker.from_env()
    container = client.containers.create(image='glefevre/floodlight', name=uuidStr())

    container.start()
    #一定要reload，才能获取到某些动态属性，比如IP地址等
    container.reload()
    # container.start()
    # container = container.reload()
    # time.sleep(10)
    print((container.attrs))

    print("*********************************")
    print((container.id))
    print((container.attrs['NetworkSettings']['Networks']['bridge']['IPAddress']))
    # myStr = commands.getstatusoutput('sudo docker ps')
    # myStr = commands.getoutput('sudo docker inspect ' + container.id)
    # print(container.short_id)
    # print(myStr)
    # print(container.attrs)