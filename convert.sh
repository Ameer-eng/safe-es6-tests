#!/bin/bash
# Appends definition of assert functions to the test files
for f in $(find ~/safe-es6-tests/break -name '*.js')
do
    cat assert.js $f > temp.txt
    mv temp.txt $f
done