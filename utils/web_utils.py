# coding=utf-8
import uuid


def uuidStr():
    return str(uuid.uuid1())




#iface参数指Linux的网卡接口，如(eth0,wlan0)，这个参数只支持Linux并且需要root权限


def unifiedResponse(request, msg):
    callback = request.args.get("callback")
    # print(callback)
    if callback != None:
        resp = callback + "(" + msg + ")"
    else:
        resp = msg
    return resp