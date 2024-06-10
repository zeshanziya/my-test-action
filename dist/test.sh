#!/usr/bin/env bash

echo "MY_CUSTOM_ENV=$(npm config get cache)" >> $GITHUB_ENV
#platform environment:url --environment=main --primary
