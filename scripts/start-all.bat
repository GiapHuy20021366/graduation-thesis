@echo off

cd /d "./start"

for %%i in (*.bat) do (
    start cmd /c "%%i"
)