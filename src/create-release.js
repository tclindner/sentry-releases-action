const core = require('@actions/core');
const SentryCli = require('@sentry/cli');
const {runCommand} = require('./runCommand');

const run = async () => {
  try {
    const cli = new SentryCli();

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const tagName = core.getInput('tagName', {
      required: true,
    });
    const environment = core.getInput('environment', {
      required: true,
    });
    const releaseNamePrefix = core.getInput('releaseNamePrefix', {
      required: false,
    });

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.0.0' to 'v1.0.0'
    const tag = tagName.replace('refs/tags/', '');
    let releaseName = tag;

    if (releaseNamePrefix) {
      releaseName = `${releaseNamePrefix}${tag}`;
    }

    core.info(`Tag is: ${tag}`);
    core.info(`Sentry release is: ${releaseName}`);

    // Create a release
    await cli.releases.new(releaseName);

    // Set commits
    await cli.releases.setCommits(releaseName, {
      repo: 'repo',
      auto: true,
    });

    /* istanbul ignore next */
    const sourceMapOptions = core.getInput('sourceMapOptions', {
      required: false,
    });

    /* istanbul ignore next */
    if (sourceMapOptions) {
      await cli.releases.uploadSourceMaps(releaseName, JSON.parse(sourceMapOptions));
    }

    // Create a deployment (A node.js function isn't exposed for this operation.)
    const sentryCliPath = SentryCli.getPath();

    core.info(`sentryCliPath: ${sentryCliPath}`);
    await runCommand(sentryCliPath, ['releases', 'deploys', releaseName, 'new', '-e', environment]);

    // Finalize the release
    await cli.releases.finalize(releaseName);
  } catch (error) {
    core.setFailed(error.message);
  }
};

module.exports = run;
