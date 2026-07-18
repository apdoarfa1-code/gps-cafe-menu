#!/bin/bash
pkill -f "node serve.js" 2>/dev/null
pkill -f vite 2>/dev/null
pkill -f "http.server" 2>/dev/null
sleep 1

cd /home/apdo/Desktop/gps
echo "=== GPS Cafe Server ==="
node serve.js &
SPID=$!
echo "Server PID: $SPID"
sleep 2

echo ""
echo "========================"
echo "✅ THE SITE IS LIVE NOW"
echo ""
echo "   Local:  http://localhost:3000"
echo "   Mobile: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "Routes:"
echo "   /home     — Home page"
echo "   /menu     — Menu with search"
echo "   /padel    — Padel booking"
echo "   /events   — Events booking"
echo "   /admin/login — Admin (code: 2026)"
echo "========================"
echo ""
echo "Hit Ctrl+C to stop"

# Verify
sleep 1
curl -s -o /dev/null -w "Health check: %{http_code}\n" http://localhost:3000

wait $SPID