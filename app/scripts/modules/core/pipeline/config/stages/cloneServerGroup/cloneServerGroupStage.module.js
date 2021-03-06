'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.core.pipeline.stage.cloneServerGroup', [
  require('./cloneServerGroupStage.js'),
  require('../stage.module.js'),
  require('../core/stage.core.module.js'),
  require('core/deploymentStrategy/deploymentStrategy.module.js'),
  require('core/account/account.module.js'),
]);
