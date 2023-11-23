@echo off
echo Start message service in production...
echo.
cd ..\..\server\message
npm run copy-views
npm start
