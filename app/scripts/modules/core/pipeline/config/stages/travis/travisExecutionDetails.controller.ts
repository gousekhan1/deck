import {module, IScope} from 'angular';
import {IStateParamsService} from 'angular-ui-router';
import {get} from 'lodash';

import {
  EXECUTION_DETAILS_SECTION_SERVICE,
  ExecutionDetailsSectionService
} from 'core/delivery/details/executionDetailsSection.service';

export class TravisExecutionDetailsCtrl {
  public configSections = ['travisConfig', 'taskStatus'];
  public detailsSection: string;
  public failureMessage: string;
  public stage: any;

  static get $inject() {
    return ['$stateParams', 'executionDetailsSectionService', '$scope'];
  }

  constructor(private $stateParams: IStateParamsService,
              private executionDetailsSectionService: ExecutionDetailsSectionService,
              private $scope: IScope) {
    this.stage = this.$scope.stage;
    this.initialize();
    this.$scope.$on('$stateChangeSuccess', () => this.initialize());
  }

  public initialized(): void {
    this.detailsSection = get<string>(this.$stateParams, 'details', '');
    this.failureMessage = this.getFailureMessage();
  }

  private getFailureMessage(): string {
    let failureMessage = this.stage.failureMessage;
    const context = this.stage.context || {},
      buildInfo = context.buildInfo || {},
      testResults = get(buildInfo, 'testResults', []),
      failingTests = testResults.filter(results => results.failCount > 0),
      failingTestCount = failingTests.reduce((acc, results) => acc + results.failCount, 0);
    if (buildInfo.result === 'FAILURE') {
      failureMessage = 'Build failed.';
    }
    if (failingTestCount) {
      failureMessage = `${failingTestCount} test${failingTestCount > 1 ? 's' : ''} failed.`;
    }
    return failureMessage;
  }

  private initialize(): void {
    this.executionDetailsSectionService.synchronizeSection(this.configSections, () => this.initialized());
  }
}

export const TRAVIS_EXECUTION_DETAILS_CONTROLLER = 'spinnaker.core.pipeline.stage.travis.executionDetails.controller';
module(TRAVIS_EXECUTION_DETAILS_CONTROLLER, [
  EXECUTION_DETAILS_SECTION_SERVICE,
  require('core/delivery/details/executionDetailsSectionNav.directive.js'),
]).controller('TravisExecutionDetailsCtrl', TravisExecutionDetailsCtrl);
