@echo off
echo Start building message service in production...
echo.
cd ..\..\server\message
npm run copy-views
npm run build
