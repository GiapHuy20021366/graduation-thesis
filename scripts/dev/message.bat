@echo off
echo Start message service in development...
echo.
cd ..\..\server\message
npm run copy-views
npm run dev
