#!/usr/bin/env bash

echo "Cleaning up last build"
rm -rf out

echo "Building frontend"
pushd frontend
  npm install .
  npm run build
popd

echo "Building release"
mkdir out
cp -r frontend/dist out/web/
