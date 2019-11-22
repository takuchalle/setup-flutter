import * as core from '@actions/core';
import * as path from 'path';
import {getFlutter} from './installer'

async function run() {
  try {
    let version = core.getInput('version');
    if (!version) {
      version = core.getInput('flutter-version', {required: true});
    }
    let channel = core.getInput('channel');
    if (!channel) {
      channel = 'stable'
    }

    await getFlutter(version, channel);
    const matchersPath = path.join(__dirname, '..', '.github');
    console.log(`##[add-matcher]${path.join(matchersPath, 'java.json')}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
