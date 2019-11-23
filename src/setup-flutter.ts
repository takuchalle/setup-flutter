import * as core from '@actions/core';
import {getFlutter} from './installer'

async function run() {
  try {
    let version = core.getInput('version');
    if (!version) {
      version = core.getInput('flutter-version');
      if(!version) {
        version = 'latest'
      }
    }
    let channel = core.getInput('channel');
    if (!channel) {
      channel = 'stable'
    }

    await getFlutter(version, channel);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
