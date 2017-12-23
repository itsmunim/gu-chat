#!/bin/sh
rimraf dist/ && babel ./src --out-dir dist/ --ignore ./node_modules,./.babelrc,./package.json,./npm-debug.log,./yarn.lock --copy-files
