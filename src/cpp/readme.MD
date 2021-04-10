# WASM Module

## Note

Call all functions from main or compiler will get rid of those..
or try -s EXPORTED_FUNCTIONS=foo,bar
https://emscripten.org/docs/tools_reference/emcc.html

## To debug

Better to run on proper environment and dummy data. QT or something? Hard to dev here. 

## To build

Get Emscripten,

open emcmdprompt.bat command prompt,

navigate here,

run command:
emcc --bind -O3 main.cpp -o ../../public/cppwasm.js