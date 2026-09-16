const path = require('path');
const Module = require('module');

const reporterPath = require.resolve('testcafe-reporter-html');
console.log('from cwd:', reporterPath);

const tcPkg = require.resolve('testcafe/package.json');
const tcDir = path.dirname(tcPkg);
console.log('testcafe dir:', tcDir);

const fromUtils = path.join(tcDir, 'lib', 'utils', 'reporter.js');
const req = Module.createRequire(fromUtils);
try {
  console.log('from reporter.js:', req.resolve('testcafe-reporter-html'));
} catch (err) {
  console.log('from reporter.js FAIL:', err.message);
}

// Simulate what TestCafe does
try {
  const factory = req('testcafe-reporter-html');
  console.log('factory type:', typeof factory);
} catch (err) {
  console.log('require FAIL:', err.message);
}
