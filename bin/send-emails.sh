#!/bin/bash
# Check if today is Monday (1 = Monday, 7 = Sunday)
if [ $(date +%u) -ne 1 ]; then
  echo "Today is not Monday. Exiting."
  exit 0
fi
yarn install
# Run the yarn start-server command
yarn start-server