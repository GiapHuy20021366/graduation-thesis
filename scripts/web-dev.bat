@echo off

cd /d "./web-dev"

for %%i in (*.bat) do (
    start cmd /c "%%i"
)