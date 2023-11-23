@echo off

cd /d "./build"

for %%i in (*.bat) do (
    start cmd /c "%%i"
)