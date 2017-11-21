#!/usr/bin/env node
require("./main.js")(process.argv.slice(2)).catch(console.error);
