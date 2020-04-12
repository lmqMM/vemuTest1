#!/usr/bin/env bash 

for i in {1..10}
do
	echo pinging $1 right now...
	ping -c 1 $1
	sleep 1
done

while true;
do
	echo keeping alive...
	sleep 1
done

