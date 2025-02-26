#!/bin/bash
echo "Running SCIM docker image..."
docker stop scim-server || true && docker rm scim-server || true
docker run --rm --name="scim-server" -p 9666:8080 -d personify/personify:3.0.6.RELEASE
echo "Waiting for SCIM image to prepare..."
sleep 10
docker ps | grep "scim-server"
echo "SCIM docker container is running."
