module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(703);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 116:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const os = __webpack_require__(87);
const path = __webpack_require__(622);
const childProcess = __webpack_require__(129);

/**
 * Absolute path to the sentry-cli binary (platform dependant).
 * @type {string}
 */
// istanbul ignore next
let binaryPath = __webpack_require__.ab + "sentry-cli";
/**
 * Overrides the default binary path with a mock value, useful for testing.
 *
 * @param {string} mockPath The new path to the mock sentry-cli binary
 */
function mockBinaryPath(mockPath) {
  binaryPath = mockPath;
}

/**
 * The javascript type of a command line option.
 * @typedef {'array'|'string'|'boolean'|'inverted-boolean'} OptionType
 */

/**
 * Schema definition of a command line option.
 * @typedef {object} OptionSchema
 * @prop {string} param The flag of the command line option including dashes.
 * @prop {OptionType} type The value type of the command line option.
 */

/**
 * Schema definition for a command.
 * @typedef {Object.<string, OptionSchema>} OptionsSchema
 */

/**
 * Serializes command line options into an arguments array.
 *
 * @param {OptionsSchema} schema An options schema required by the command.
 * @param {object} options An options object according to the schema.
 * @returns {string[]} An arguments array that can be passed via command line.
 */
function serializeOptions(schema, options) {
  return Object.keys(schema).reduce((newOptions, option) => {
    const paramValue = options[option];
    if (paramValue === undefined) {
      return newOptions;
    }

    const paramType = schema[option].type;
    const paramName = schema[option].param;

    if (paramType === 'array') {
      if (!Array.isArray(paramValue)) {
        throw new Error(`${option} should be an array`);
      }

      return newOptions.concat(
        paramValue.reduce((acc, value) => acc.concat([paramName, String(value)]), [])
      );
    }

    if (paramType === 'boolean') {
      if (typeof paramValue !== 'boolean') {
        throw new Error(`${option} should be a bool`);
      }

      const invertedParamName = schema[option].invertedParam;

      if (paramValue && paramName !== undefined) {
        return newOptions.concat([paramName]);
      }

      if (!paramValue && invertedParamName !== undefined) {
        return newOptions.concat([invertedParamName]);
      }

      return newOptions;
    }

    return newOptions.concat(paramName, paramValue);
  }, []);
}

/**
 * Serializes the command and its options into an arguments array.
 *
 * @param {string} command The literal name of the command.
 * @param {OptionsSchema} [schema] An options schema required by the command.
 * @param {object} [options] An options object according to the schema.
 * @returns {string[]} An arguments array that can be passed via command line.
 */
function prepareCommand(command, schema, options) {
  return command.concat(serializeOptions(schema || {}, options || {}));
}

/**
 * Returns the absolute path to the `sentry-cli` binary.
 * @returns {string}
 */
function getPath() {
  return __webpack_require__.ab + "sentry-cli";
}

/**
 * Runs `sentry-cli` with the given command line arguments.
 *
 * Use {@link prepareCommand} to specify the command and add arguments for command-
 * specific options. For top-level options, use {@link serializeOptions} directly.
 *
 * The returned promise resolves with the standard output of the command invocation
 * including all newlines. In order to parse this output, be sure to trim the output
 * first.
 *
 * If the command failed to execute, the Promise rejects with the error returned by the
 * CLI. This error includes a `code` property with the process exit status.
 *
 * @example
 * const output = await execute(['--version']);
 * expect(output.trim()).toBe('sentry-cli x.y.z');
 *
 * @param {string[]} args Command line arguments passed to `sentry-cli`.
 * @param {boolean} live We inherit stdio to display `sentry-cli` output directly.
 * @param {boolean} silent Disable stdout for silents build (CI/Webpack Stats, ...)
 * @returns {Promise.<string>} A promise that resolves to the standard output.
 */
function execute(args, live, silent) {
  const env = Object.assign({}, process.env);
  return new Promise((resolve, reject) => {
    if (live === true) {
      const pid = childProcess.spawn(getPath(), args, {
        env,
        stdio: ['inherit', silent ? 'pipe' : 'inherit', 'inherit'],
      });
      pid.on('exit', () => {
        resolve();
      });
    } else {
      childProcess.execFile(getPath(), args, { env }, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    }
  });
}

module.exports = {
  mockBinaryPath,
  serializeOptions,
  prepareCommand,
  getPath,
  execute,
};


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 180:
/***/ (function(module) {

module.exports = {"_from":"@sentry/cli","_id":"@sentry/cli@1.48.0","_inBundle":false,"_integrity":"sha512-Td6UpZP6BoI0R5Guctiq3NIphAfskbyeiboWx4H1yuXPA9p4F0hL+Hrz6k3NNfzkt3AQzEkeAhvpKmIfmUOkjA==","_location":"/@sentry/cli","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@sentry/cli","name":"@sentry/cli","escapedName":"@sentry%2fcli","scope":"@sentry","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/@sentry/cli/-/cli-1.48.0.tgz","_shasum":"cccf2badd3fab9aeaafeaf6ef21bc74e2f6b6790","_spec":"@sentry/cli","_where":"/Users/thomaslindner/git/actions-temp","bin":{"sentry-cli":"bin/sentry-cli"},"bugs":{"url":"https://github.com/getsentry/sentry-cli/issues"},"bundleDependencies":false,"dependencies":{"fs-copy-file-sync":"^1.1.1","https-proxy-agent":"^3.0.0","mkdirp":"^0.5.1","node-fetch":"^2.1.2","progress":"2.0.0","proxy-from-env":"^1.0.0"},"deprecated":false,"description":"A command line utility to work with Sentry. https://docs.sentry.io/hosted/learn/cli/","devDependencies":{"eslint":"^4.19.1","eslint-config-airbnb-base":"^12.1.0","eslint-config-prettier":"^2.9.0","eslint-plugin-import":"^2.12.0","jest":"^21.2.1","npm-run-all":"^4.1.3","prettier":"^1.13.4","prettier-check":"^2.0.0"},"engines":{"node":">= 4.5.0"},"homepage":"https://docs.sentry.io/hosted/learn/cli/","jest":{"collectCoverage":true,"testEnvironment":"node"},"keywords":["sentry","sentry-cli","cli"],"license":"BSD-3-Clause","main":"js/index.js","name":"@sentry/cli","repository":{"type":"git","url":"git+https://github.com/getsentry/sentry-cli.git"},"scripts":{"fix":"npm-run-all fix:eslint fix:prettier","fix:eslint":"eslint --fix \"bin/*\" js","fix:prettier":"prettier --write \"bin/*\" \"scripts/*.js\" \"js/**/*.js\"","install":"node scripts/install.js","test":"npm-run-all test:jest test:eslint test:prettier","test:eslint":"eslint bin scripts js","test:jest":"jest","test:prettier":"prettier-check \"bin/*\" \"scripts/*.js\" \"js/**/*.js\"","test:watch":"jest --watch --notify"},"version":"1.48.0"};

/***/ }),

/***/ 270:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(310);
const SentryCli = __webpack_require__(340);
const fs = __webpack_require__(747);
const {runCommand} = __webpack_require__(737);

const run = async () => {
  try {
    core.addPath('/home/runner/work/_actions/tclindner/sentry-releases-action/master/dist');
    const cli = new SentryCli();

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    // const tagName = core.getInput('tagName', {
    //   required: true
    // });
    // const environment = core.getInput('environment', {
    //   required: true
    // });
    const tagName = 'v1.0.0';
    const environment = 'qa';

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.0.0' to 'v1.0.0'
    const tag = tagName.replace('refs/tags/', '');

    core.info(`Tag is: ${tag}`);
    // Create a release
    // await cli.releases.new(tag);

    // Set commits
    // await cli.releases.setCommits(tag, {
    //   repo: 'repo',
    //   auto: true
    // });

    // Create a deployment (A node.js function isn't exposed for this operation.)
    const sentryCliPath = SentryCli.getPath();

    core.info(fs.existsSync(sentryCliPath));
    core.info(process.cwd());
    core.info(fs.readdirSync(process.cwd()));
    core.info(fs.readdirSync('/home/runner/work/_actions/tclindner/sentry-releases-action/master/dist/'));
    core.info(`sentryCliPath: ${sentryCliPath}`);
    await runCommand(sentryCliPath, ['releases', 'deploys', tag, 'new', '-e', environment]);

    // Finalize the release
    // await cli.releases.finalize(tag);
  } catch (error) {
    core.setFailed(error.message);
  }
};

module.exports = run;


/***/ }),

/***/ 310:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(997);
const os = __webpack_require__(87);
const path = __webpack_require__(622);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 340:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const pkgInfo = __webpack_require__(180);
const helper = __webpack_require__(116);
const Releases = __webpack_require__(466);

/**
 * Interface to and wrapper around the `sentry-cli` executable.
 *
 * Commands are grouped into namespaces. See the respective namespaces for more
 * documentation. To use this wrapper, simply create an instance and call methods:
 *
 * @example
 * const cli = new SentryCli();
 * console.log(cli.getVersion());
 *
 * @example
 * const cli = new SentryCli('path/to/custom/sentry.properties');
 * console.log(cli.getVersion());
 */
class SentryCli {
  /**
   * Creates a new `SentryCli` instance.
   *
   * If the `configFile` parameter is specified, configuration located in the default
   * location and the value specified in the `SENTRY_PROPERTIES` environment variable is
   * overridden.
   *
   * @param {string} [configFile] Relative or absolute path to the configuration file.
   * @param {Object} [options] More options to pass to the CLI
   */
  constructor(configFile, options) {
    if (typeof configFile === 'string') {
      process.env.SENTRY_PROPERTIES = configFile;
    }
    this.options = options || { silent: false };

    this.releases = new Releases(this.options);
  }

  /**
   * Returns the version of the installed `sentry-cli` binary.
   * @returns {string}
   */
  static getVersion() {
    return pkgInfo.version;
  }

  /**
   * Returns an absolute path to the `sentry-cli` binary.
   * @returns {string}
   */
  static getPath() {
    return helper.getPath();
  }

  /**
   * See {helper.execute} docs.
   * @param {string[]} args Command line arguments passed to `sentry-cli`.
   * @param {boolean} live We inherit stdio to display `sentry-cli` output directly.
   * @returns {Promise.<string>} A promise that resolves to the standard output.
   */
  execute(args, live) {
    return helper.execute(args, live, this.options.silent);
  }
}

module.exports = SentryCli;


/***/ }),

/***/ 355:
/***/ (function(module) {

module.exports = {
  ignore: {
    param: '--ignore',
    type: 'array',
  },
  ignoreFile: {
    param: '--ignore-file',
    type: 'string',
  },
  rewrite: {
    param: '--rewrite',
    invertedParam: '--no-rewrite',
    type: 'boolean',
  },
  sourceMapReference: {
    invertedParam: '--no-sourcemap-reference',
    type: 'boolean',
  },
  stripPrefix: {
    param: '--strip-prefix',
    type: 'array',
  },
  stripCommonPrefix: {
    param: '--strip-common-prefix',
    type: 'boolean',
  },
  validate: {
    param: '--validate',
    type: 'boolean',
  },
  urlPrefix: {
    param: '--url-prefix',
    type: 'string',
  },
  urlSuffix: {
    param: '--url-suffix',
    type: 'string',
  },
  ext: {
    param: '--ext',
    type: 'array',
  },
};


/***/ }),

/***/ 466:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const helper = __webpack_require__(116);

/**
 * Default arguments for the `--ignore` option.
 * @type {string[]}
 */
const DEFAULT_IGNORE = ['node_modules'];

/**
 * Schema for the `upload-sourcemaps` command.
 * @type {OptionsSchema}
 */
const SOURCEMAPS_SCHEMA = __webpack_require__(355);

/**
 * Manages releases and release artifacts on Sentry.
 * @namespace SentryReleases
 */
class Releases {
  /**
   * Creates a new `Releases` instance.
   *
   * @param {Object} [options] More options to pass to the CLI
   */
  constructor(options) {
    this.options = options || {};
  }

  /**
   * Registers a new release with sentry.
   *
   * The given release name should be unique and deterministic. It can later be used to
   * upload artifacts, such as source maps.
   *
   * @param {string} release Unique name of the new release.
   * @returns {Promise} A promise that resolves when the release has been created.
   * @memberof SentryReleases
   */
  new(release) {
    return helper.execute(['releases', 'new', release], null, this.options.silent);
  }

  /**
   * Specifies the set of commits covered in this release.
   *
   * @param {string} release Unique name of the release
   * @param {object} options A set of options to configure the commits to include
   * @param {string} options.repo The full repo name as defined in Sentry
   * @param {boolean} options.auto Automatically choose the associated commit (uses
   * the current commit). Overrides other options.
   * @param {string} options.commit The current (last) commit in the release.
   * @param {string} options.previousCommit The commit before the beginning of this
   * release (in other words, the last commit of the previous release). If omitted,
   * this will default to the last commit of the previous release in Sentry. If there
   * was no previous release, the last 10 commits will be used.
   * @returns {Promise} A promise that resolves when the commits have been associated
   * @memberof SentryReleases
   */
  setCommits(release, options) {
    if (!options || !options.repo || (!options.auto && !options.commit)) {
      throw new Error(
        'options.repo, and either options.commit or options.auto must be specified'
      );
    }

    let commitFlags = [];

    if (options.auto) {
      commitFlags = ['--auto'];
    } else if (options.previousCommit) {
      commitFlags = [
        '--commit',
        `${options.repo}@${options.previousCommit}..${options.commit}`,
      ];
    } else {
      commitFlags = ['--commit', `${options.repo}@${options.commit}`];
    }

    return helper.execute(['releases', 'set-commits', release].concat(commitFlags));
  }

  /**
   * Marks this release as complete. This should be called once all artifacts has been
   * uploaded.
   *
   * @param {string} release Unique name of the release.
   * @returns {Promise} A promise that resolves when the release has been finalized.
   * @memberof SentryReleases
   */
  finalize(release) {
    return helper.execute(['releases', 'finalize', release], null, this.options.silent);
  }

  /**
   * Creates a unique, deterministic version identifier based on the project type and
   * source files. This identifier can be used as release name.
   *
   * @returns {Promise.<string>} A promise that resolves to the version string.
   * @memberof SentryReleases
   */
  proposeVersion() {
    return helper
      .execute(['releases', 'propose-version'], null, this.options.silent)
      .then(version => version && version.trim());
  }

  /**
   * Scans the given include folders for JavaScript source maps and uploads them to the
   * specified release for processing.
   *
   * The options require an `include` array, which is a list of directories to scan.
   * Additionally, it supports to ignore certain files, validate and preprocess source
   * maps and define a URL prefix.
   *
   * @example
   * await cli.releases.uploadSourceMaps(cli.releases.proposeVersion(), {
   *   // required options:
   *   include: ['build'],
   *
   *   // default options:
   *   ignore: ['node_modules'],  // globs for files to ignore
   *   ignoreFile: null,          // path to a file with ignore rules
   *   rewrite: false,            // preprocess sourcemaps before uploading
   *   sourceMapReference: true,  // add a source map reference to source files
   *   stripPrefix: [],           // remove certain prefices from filenames
   *   stripCommonPrefix: false,  // guess common prefices to remove from filenames
   *   validate: false,           // validate source maps and cancel the upload on error
   *   urlPrefix: '',             // add a prefix source map urls after stripping them
   *   urlSuffix: '',             // add a suffix source map urls after stripping them
   *   ext: ['js', 'map', 'jsbundle', 'bundle'],  // override file extensions to scan for
   * });
   *
   * @param {string} release Unique name of the release.
   * @param {object} options Options to configure the source map upload.
   * @returns {Promise} A promise that resolves when the upload has completed successfully.
   * @memberof SentryReleases
   */
  uploadSourceMaps(release, options) {
    if (!options || !options.include) {
      throw new Error('options.include must be a vaild path(s)');
    }

    const uploads = options.include.map(sourcemapPath => {
      const newOptions = Object.assign({}, options);
      if (!newOptions.ignoreFile && !newOptions.ignore) {
        newOptions.ignore = DEFAULT_IGNORE;
      }

      const args = ['releases', 'files', release, 'upload-sourcemaps', sourcemapPath];
      return helper.execute(
        helper.prepareCommand(args, SOURCEMAPS_SCHEMA, newOptions),
        true,
        this.options.silent
      );
    });

    return Promise.all(uploads);
  }
}

module.exports = Releases;


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 703:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const run = __webpack_require__(270);

if (require.main === require.cache[eval('__filename')]) {
  run();
}


/***/ }),

/***/ 737:
/***/ (function(module, __unusedexports, __webpack_require__) {

const {execFile} = __webpack_require__(129);

const runCommand = async (filePath, args) => {
  return new Promise((resolve, reject) => {
    execFile(filePath, args, (error, stdout) => {
      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });
};

module.exports = {
  runCommand
};


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 997:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(87);
/**
 * Commands
 *
 * Command Format:
 *   ##[name key=value;key=value]message
 *
 * Examples:
 *   ##[warning]This is the user warning message
 *   ##[set-secret name=mypassword]definitelyNotAPassword!
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        // safely append the val - avoid blowing up when attempting to
                        // call .replace() if message is not a string for some reason
                        cmdStr += `${key}=${escape(`${val || ''}`)},`;
                    }
                }
            }
        }
        cmdStr += CMD_STRING;
        // safely append the message - avoid blowing up when attempting to
        // call .replace() if message is not a string for some reason
        const message = `${this.message || ''}`;
        cmdStr += escapeData(message);
        return cmdStr;
    }
}
function escapeData(s) {
    return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function escape(s) {
    return s
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/]/g, '%5D')
        .replace(/;/g, '%3B');
}
//# sourceMappingURL=command.js.map

/***/ })

/******/ });