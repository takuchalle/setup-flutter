import {getFlutter} from '../src/installer'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('empty', async() => {
    getFlutter('v1.9.1+hotfix.6', 'stable');
});
