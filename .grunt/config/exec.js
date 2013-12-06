module.exports = {
  unzip: {
    cmd: 'unzip pmd-bin.zip',
    cwd: 'reporter_tools',
    exitCode: 80
  },
  patchpmd: {
    cmd: 'unzip commons-io.zip && cp commons-io-2.4/commons-io-2.4.jar pmd-bin-5.0.5/lib/',
    cwd: 'reporter_tools'
  },
  fixture: {
    cmd: 'reporter_tools/pmd-bin-5.0.5/bin/run.sh cpd  --minimum-tokens 10 --files ./test/fixture --language ecmascript --format csv',
    cwd: '.',
    exitCode: 4
  }
};
