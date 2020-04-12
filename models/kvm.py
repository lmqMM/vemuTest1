# from mininet.node import *
from mininet.net import *
from lxml import etree
import libvirt
import uuid
import os
from util import *

class VirtNet(Mininet):
    pass




class KVMHost():
    kvmDom = None
    connection = None
    xmlConfigTree = None
    xmlConfigFile = ''

    def __init__(self, xmlConfigFile):

        self.connection = libvirt.open('qemu:///system')
        if self.connection == None:
            print('failed to connect to qemu/kvm hypervisor')
            exit(1)

        self.xmlConfigFile = xmlConfigFile
        self.xmlConfigTree = etree.parse(self.xmlConfigFile)

    def create(self):
        xmlConfigStr = etree.tostring(self.xmlConfigTree)
        self.kvmDom = self.connection.createXML(xmlConfigStr)
        if self.kvmDom == None:
            print('failed to create qemu/kvm domain')
            exit(1)

    def destory(self):
        pass

    def configureVMName(self):
        nameList = self.xmlConfigTree.xpath('//name')
        nameEle = nameList[0]
        name = uuidStr()
        nameEle.text = name
        print((etree.tostring(nameEle)))


    def configureInterface(self, sw):
        interfaceList = self.xmlConfigTree.xpath('//interface')
        if len(interfaceList) > 1:
            print('for now, we do not support more than 1 interface')
            exit(1)
        ifterfaceEle = interfaceList[0]
        sourceEle = ifterfaceEle.xpath('source')[0]
        sourceEle.set('bridge', sw.name)

        print((etree.tostring(ifterfaceEle)))

    def configureDisk(self, imagePath):
        diskList = self.xmlConfigTree.xpath('//disk[@device="disk"]')
        diskEle = diskList[0]

        sourceEle = diskEle.xpath('source')[0]
        sourceEle.set('file', imagePath)
        print((etree.tostring(diskEle)))

    def configureVCPU(self, number):
        pass

    def configureMemory(self, kb):
        pass