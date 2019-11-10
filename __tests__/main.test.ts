import {extractValue} from '../src/inputValidation'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('extract defined value', async() => {
    let ok = 'ok';
    expect(extractValue(ok)).toBe(ok);
});

test('extract undefined value', async() => {
    var und;
    expect(() => {extractValue(und)}).toThrow(
        "failed to extract value because it's undefined");
});

// test('wait 500 ms', async() => {
//     const start = new Date();
//     await wait(500);
//     const end = new Date();
//     var delta = Math.abs(end.getTime() - start.getTime());
//     expect(delta).toBeGreaterThan(450);
// });

// // shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//     process.env['INPUT_MILLISECONDS'] = '500';
//     const ip = path.join(__dirname, '..', 'lib', 'main.js');
//     const options: cp.ExecSyncOptions = {
//         env: process.env
//     };
//     console.log(cp.execSync(`node ${ip}`, options).toString());
// });