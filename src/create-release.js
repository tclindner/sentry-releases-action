const core = require('@actions/core');
const SentryCli = require('@sentry/cli');
const {runCommand} = require('./runCommand');

const run = async () => {
  try {
    const cli = new SentryCli();

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const tagName = core.getInput('tagName', {
      required: true
    });
    const environment = core.getInput('environment', {
      required: true
    });

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.0.0' to 'v1.0.0'
    const tag = tagName.replace('refs/tags/', '');

    core.info(`Tag is: ${tag}`);
    // Create a release
    await cli.releases.new(tag);

    // Set commits
    await cli.releases.setCommits(tag, {
      repo: 'repo',
      auto: true
    });

    // Create a deployment (A node.js function isn't exposed for this operation.)
    const sentryCliPath = SentryCli.getPath();

    core.info(`sentryCliPath: ${sentryCliPath}`);
    await runCommand(sentryCliPath, ['releases', 'deploys', tag, 'new', '-e', environment]);

    // Finalize the release
    await cli.releases.finalize(tag);
  } catch (error) {
    core.setFailed(error.message);
  }
};

module.exports = run;
