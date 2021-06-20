#!/bin/bash
# Appends definition of assert functions to the test files
rm -rf tests
mkdir tests
cp -R backup/. tests/
for f in $(find tests -name '*.js')
do
    if grep -q -e '$DONOTEVALUATE' -e '$ERROR' -e '$DONE' "$f"; then
    rm $f
    fi
done
for f in $(find tests -name '*.js')
do
    cat edited-harness/allCode.js $f > temp.txt
    mv temp.txt $f
done
