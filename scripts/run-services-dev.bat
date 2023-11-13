@echo off
echo Running services in development mode
echo.
cd ..\server\

# services path
set gateway_service=.\gateway\
set user_service=.\user\
set message_service=.\message\

# run gateway service
cd /d %gateway_service%
start cmd /k npm run dev
cd ../

# run user service
cd /d %user_service%
start cmd /k npm run dev
cd ../

# run message service
cd /d %message_service%
start cmd /k npm run dev
cd ../
