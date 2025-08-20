#!/usr/bin/env bash
set -euo pipefail
apt-get update -y
apt-get install -y wget gnupg ca-certificates
wget -qO- https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update -y
apt-get install -y google-chrome-stable
echo "[chrome] Installed at /usr/bin/google-chrome-stable"
