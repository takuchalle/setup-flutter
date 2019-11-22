import * as core from '@actions/core';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';


const baseUrl = 'https://storage.googleapis.com/flutter_infra/releases';

export function getFlutter(version: string, channel: string) {
    let filename = getFileName(version, channel)
    let url = getFileUrl(filename, channel)

    console.log(url)
}

function getPlatformName() : string {
    switch(os.platform()) {
        case 'darwin': { return 'macos' }
        case 'win32': { return 'windows'}
        default: { return 'linunx' }
    }
}

function getFileName(version: string, channel: string): string {
    const platform: string = getPlatformName();
    const ext: string = platform == 'linunx' ? 'tar.xz' : 'zip';
    const filename: string = util.format(
      'flutter_%s_%s-%s.%s',
      platform,
      version,
      channel,
      ext
    );
    return filename;
}

function getFileUrl(filename: string, channel: string): string {
    const platform: string = getPlatformName();
    return util.format(
        '%s/%s/%s/%s',
        baseUrl,
        channel,
        platform,
        filename
      );
}