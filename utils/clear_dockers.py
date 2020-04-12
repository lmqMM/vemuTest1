# coding=utf-8
import docker

# 这段代码仅用于调试之用，彻底删除所有的docker容器。
client = docker.from_env()
collection = client.containers.list(all=True)

for cont in collection:
    print((cont.id))
    cont.stop()
    cont.remove()
