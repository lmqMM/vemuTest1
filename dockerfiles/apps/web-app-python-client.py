import argparse
import numpy as np
import time
import urllib.request, urllib.error, urllib.parse

parser = argparse.ArgumentParser(description='manual to this script')
parser.add_argument('--idle-base', type=float, default=20)
parser.add_argument('--interval-base', type=float, default=20)
parser.add_argument('--counts', type=int, default=20)
parser.add_argument('--url', type=str, default='http://www.swunix.com')

args = parser.parse_args()

print((args.idle_base))
print((args.interval_base))
print((args.counts))
print((args.url))

idle_base = args.idle_base
interval_base = args.interval_base
counts = args.counts
url = args.url

idle = np.random.uniform(0, idle_base)
time.sleep(idle)

for i in range(counts):
    interval = np.random.uniform(0, interval_base)
    print(interval)
    response = urllib.request.urlopen(url)
    html = response.read()
    print(html)
    time.sleep(interval)



