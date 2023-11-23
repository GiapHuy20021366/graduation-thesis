@echo off

cd /d "./dev"

for %%i in (*.bat) do (
    start cmd /c "%%i"
)