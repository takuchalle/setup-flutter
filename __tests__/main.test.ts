import io = require('@actions/io');
import fs = require('fs');
import os = require('os');
import path = require('path');

const toolDir = path.join(__dirname, 'runner', 'tools');
const tempDir = path.join(__dirname, 'runner', 'temp');
const dataDir = path.join(__dirname, 'data');

process.env['RUNNER_TOOL_CACHE'] = toolDir;
process.env['RUNNER_TEMP'] = tempDir;
import * as installer from '../src/installer';


describe('installer tests', () => {
    beforeAll(async () => {
      await io.rmRF(toolDir);
      await io.rmRF(tempDir);
    }, 100000);
  
    afterAll(async () => {
      try {
        await io.rmRF(toolDir);
        await io.rmRF(tempDir);
      } catch {
        console.log('Failed to remove test directories');
      }
    }, 100000);

    it('Download latest version from stable channel ', async () => {
        await installer.getFlutter('latest', 'stable');
      }, 100000);
    
    it('Download latest version from beta channel ', async () => {
        await installer.getFlutter('latest', 'beta');
    }, 100000);

    it('Download latest version from dev channel ', async () => {
        await installer.getFlutter('latest', 'dev');
    }, 100000);

    it('Download specified version flutter from stable channel ', async () => {
        await installer.getFlutter('v1.9.1+hotfix.6', 'stable');
        const sdkDir = path.join(toolDir, 'flutter', '1.9.1', os.arch());

        expect(fs.existsSync(`${sdkDir}.complete`)).toBe(true);
        expect(fs.existsSync(path.join(sdkDir, 'bin'))).toBe(true);
      }, 100000);

    it('Download specified version flutter from beta channel ', async () => {
        await installer.getFlutter('v1.11.0', 'beta');
        const sdkDir = path.join(toolDir, 'flutter', '1.11.0', os.arch());

        expect(fs.existsSync(path.join(sdkDir, 'bin'))).toBe(true);
    }, 100000);

    it('Download specified version flutter from dev channel ', async () => {
        await installer.getFlutter('v1.12.7', 'dev');
        const sdkDir = path.join(toolDir, 'flutter', '1.12.7', os.arch());

        expect(fs.existsSync(path.join(sdkDir, 'bin'))).toBe(true);
    }, 100000);

});