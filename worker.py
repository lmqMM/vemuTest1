# -*- coding: utf-8 -*-
import argparse
import requests
import json
from utils import address_utils
import sys
from deployment import deployer


f = open("config/master.json")
master_config = json.load(f)
f.close()

f = open("config/worker.json")
worker_config = json.load(f)
f.close()

def register(master_ip, master_port, api):

    url = 'http://%s:%s%s' % (master_ip, master_port, api)

    worker = {
        "ip": address_utils.get_host_ip(),
        "mac": address_utils.get_mac_address()
    }

    print("Trying to register this worker: ")
    print(worker)

    try:
        response = requests.get(url=url, params=worker)
        data = response.text
        register_result = json.loads(data)
        print(register_result)
        return register_result

    except RuntimeError:
        print("Cannot register to the master. I won't be launched as a worker machine.")
        return None



if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='worker machine arguments')
    parser.add_argument('--master-ip', type=str)
    parser.add_argument('--master-port', type=str)
    args = parser.parse_args()
    master_ip = args.master_ip
    master_port = args.master_port

    if master_ip == "" or master_ip == None or master_port == "" or master_port == None:
        print("Please provide master-ip and master-port. Usage: ")
        print("python3 worker.py --master-ip=[IP address] --master-port=[Port number]")
        sys.exit(1)

    print("Networking master configuration: ")
    print(worker_config)

    register_result = register(master_ip, master_port, master_config["register-worker-api"])
    print("Register result: ")
    print(register_result)

    if register_result['status'] == 'OK':
        print("Register successfully!")
        deployer.launchDeployer()
    else:
        print("Cannot register to the master. I won't be launched as a worker machine.")
