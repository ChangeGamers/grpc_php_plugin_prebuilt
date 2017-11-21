const fse = require("fs-extra");
const util = require("util");
const path = require("path");
const decompress = require('decompress');
const child_process = require("child_process");

const request = (url) => new Promise((resolve, reject) => {
	require("request")(url, {encoding: null}, (err, response, body) => {
		if(err) {
			reject(err);
		} else {
			resolve(body);
		}
	});
});

const REPO = "http://github.com/ChangeGamers/grpc_php_plugin_prebuilt";

const OUT_DIR = path.resolve(__dirname, "../binaries", process.platform);
const EXE_EXT = process.platform == 'win32' ? '.exe' : '';
const PLUGIN_NAME = 'grpc_php_plugin';
const PLUGIN_PATH = path.resolve(OUT_DIR, PLUGIN_NAME + EXE_EXT);
const PLUGIN_ZIP_URL = REPO +
	`/releases/download/v1.7.2/${process.platform}-${PLUGIN_NAME}.zip`;

async function start(args) {
	if(!await fse.exists(PLUGIN_PATH)) {
		await fse.ensureDir(OUT_DIR);
		await decompress(await request(PLUGIN_ZIP_URL), OUT_DIR);
	}

	child_process.spawn(PLUGIN_PATH, args, {
		stdio: 'inherit'
	});
}

start.GRPC_PHP_PLUGIN_PATH = PLUGIN_PATH;

module.exports = start;
