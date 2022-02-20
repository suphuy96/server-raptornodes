const {Base64} = require("js-base64");
const config = require("./config");
const creDotMatrix = require("./encode");
const objDot = JSON.parse(JSON.stringify(config));

creDotMatrix(Base64.encode(config.SESSION_SECRET),"dot.png",objDot);
