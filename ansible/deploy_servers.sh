#!/bin/bash

./grp-26-openrc.sh; ansible-playbook -e "configure_cluster=True" deploy_servers.yaml -i inventory/hosts.ini