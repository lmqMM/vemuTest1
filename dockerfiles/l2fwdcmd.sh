pid=$(pgrep "l2fwd")
kill $pid
./examples/l2fwd_shaper_pdrop/build/l2fwd -c 0x3 -n 1 --socket-mem 1024 --file-prefix=shaper2  --no-pci                 --vdev 'net_virtio_user21,mac=00:00:00:00:00:02,path=/var/run/openvswitch/vhost1shaper2'                 --vdev 'net_virtio_user22,mac=00:00:00:00:00:03,path=/var/run/openvswitch/vhost2shaper2' -- -p 0x3 --no-mac-updating