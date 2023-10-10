@echo off
echo Mở Command Prompt và điều hướng đến các thư mục
echo.

# Gateway
set gateway=.\gateway\

cd /d %gateway%
start cmd /k npm run dev
cd ../

# User
# set user=.\user\

# cd /d %folder2%
# start cmd /k npm run dev
# cd ../
