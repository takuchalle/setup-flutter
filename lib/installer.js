"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require("os"));
const util = __importStar(require("util"));
const baseUrl = 'https://storage.googleapis.com/flutter_infra/releases';
function getFlutter(version, channel) {
    let filename = getFileName(version, channel);
    let url = getFileUrl(filename, channel);
    console.log(url);
}
exports.getFlutter = getFlutter;
function getPlatformName() {
    switch (os.platform()) {
        case 'darwin': {
            return 'macos';
        }
        case 'win32': {
            return 'windows';
        }
        default: {
            return 'linunx';
        }
    }
}
function getFileName(version, channel) {
    const platform = getPlatformName();
    const ext = platform == 'linunx' ? 'tar.xz' : 'zip';
    const filename = util.format('flutter_%s_%s-%s.%s', platform, version, channel, ext);
    return filename;
}
function getFileUrl(filename, channel) {
    const platform = getPlatformName();
    return util.format('%s/%s/%s/%s', baseUrl, channel, platform, filename);
}
