// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';

const baseUrl = 'https://storage.googleapis.com/flutter_infra/releases';

if (!tempDirectory) {
    let baseLocation;
    if (process.platform === 'win32') {
      // On windows use the USERPROFILE env variable
      baseLocation = process.env['USERPROFILE'] || 'C:\\';
    } else {
      if (process.platform === 'darwin') {
        baseLocation = '/Users';
      } else {
        baseLocation = '/home';
      }
    }
    tempDirectory = path.join(baseLocation, 'actions', 'temp');
  }

export async function getFlutter(version: string, channel: string) {
    let toolPath = await acquireFlutter(version, channel);
    let binPath = path.join(toolPath, 'bin');
    core.addPath(binPath);
}

async function acquireFlutter(version: string, channel: string) : Promise<string> {
    let filename = getFileName(version, channel)
    let downloadUrl = getFileUrl(filename, channel)
    let downloadPath: string | null = null;
    try {
      downloadPath = await tc.downloadTool(downloadUrl);
    } catch (error) {
      core.debug(error);
  
      throw `Failed to download ${filename}: ${error}`;
    }

  //
  // Extract
  //
  let extPath: string = tempDirectory;
  if (!extPath) {
    throw new Error('Temp directory not set');
  }

  if (process.platform == 'linux') {
    extPath = await tc.extractTar(downloadPath, undefined, 'x');
  } else {
    extPath = await tc.extractZip(downloadPath, undefined);
  }
  console.log(extPath)
  return extPath
}

function getPlatformName() : string {
    switch(os.platform()) {
        case 'darwin': { return 'macos' }
        case 'win32': { return 'windows'}
        default: { return 'linux' }
    }
}

function getFileName(version: string, channel: string): string {
    const platform: string = getPlatformName();
    const ext: string = platform == 'linux' ? 'tar.xz' : 'zip';
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