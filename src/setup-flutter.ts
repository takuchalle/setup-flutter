import * as core from '@actions/core';
import {getFlutter} from './installer'

async function run() {
  try {
    let version = core.getInput('version');
    if (!version) {
      version = core.getInput('flutter-version', {required: true});
    }


    const ms = core.getInput('milliseconds');
    console.log(`Waiting ${ms} milliseconds ...`)

    core.debug((new Date()).toTimeString())
    await getFlutter(parseInt(ms, 10));
    core.debug((new Date()).toTimeString())

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
