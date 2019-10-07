#!/usr/bin/env bash

echo "Cleaning up last build"
rm -rf out

echo "Checking for NPM"
if ! type "npm" > /dev/null; then
  echo "NPM not found, installing"
  if ! type "apt-get" > /dev/null
  then
      echo "Apt-get not found, cannot install npm!"
      exit 1
  fi
  apt-get install npm
else
  echo "NPM found!"
fi

echo "Building frontend"
pushd frontend
  npm install .
  npm run build
popd

echo "Building release"
mkdir out
cp -r frontend/dist out/web/
