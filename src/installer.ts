// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as restm from 'typed-rest-client/RestClient';
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
    if(version === 'latest') {
        version = await getLatestVersion(channel);
    }
    let toolPath = tc.find('flutter', version);

    if(toolPath) {
        core.debug(`Tool found in cache ${toolPath}`);
    } else {
        let sdkPath = await acquireFlutter(version, channel);
        toolPath = await tc.cacheDir(sdkPath, 'flutter', version);
    }
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

    let extPath: string = tempDirectory;
    if (!extPath) {
        throw new Error('Temp directory not set');
    }

    if (process.platform == 'linux') {
        extPath = await tc.extractTar(downloadPath, undefined, 'x');
    } else {
        extPath = await tc.extractZip(downloadPath, undefined);
    }
    return path.join(extPath, 'flutter');
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

interface IFlutterCurrentRelease {
    [key: string]: string;
    beta: string;
    dev: string;
    stable: string;
}
  
interface IFlutterRelease {
    hash: string;
    channel: string;
    version: string;
}
  
interface IFlutterRef {
    current_release: IFlutterCurrentRelease;
    releases: IFlutterRelease[];
}

async function getLatestVersion(channel: string) : Promise<string> {
    const platform: string = getPlatformName();
    let releasesUrl = util.format('%s/releases_%s.json', baseUrl, platform);
    console.log(releasesUrl);
    const rest: restm.RestClient = new restm.RestClient('setup-flutter');
    const ref: IFlutterRef | null = (await rest.get<IFlutterRef | null>(
        releasesUrl
      )).result;
    
    if (!ref) {
        throw new Error('unable to get flutter release ref');
    }

    const channelVersion = ref.releases.find(
        release => release.hash === ref.current_release[channel]
      );
    if (!channelVersion) {
        throw new Error(`unable to get latest version from channel ${channel}`);
    }

    return channelVersion.version;
}
