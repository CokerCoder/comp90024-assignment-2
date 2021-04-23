#!/bin/bash

./grp-26-openrc.sh; ansible-playbook deploy_servers.yaml -i inventory/hosts.ini