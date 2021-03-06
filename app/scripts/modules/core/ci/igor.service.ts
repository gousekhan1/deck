import {IPromise, module, IQService} from 'angular';

import {API_SERVICE, Api} from 'core/api/api.service';
import {IBuild} from 'core/domain/IBuild';
import {IJobConfig} from 'core/domain/IJobConfig';

export enum BuildServiceType {
  Jenkins, Travis
}

export class IgorService {
  static get $inject() { return ['API', '$q']; }

  constructor(private API: Api, private $q: IQService) {}

  public listMasters(type: BuildServiceType = null): IPromise<string[]> {
    const allMasters: IPromise<string[]> = this.API.one('v2').one('builds').get();
    if (!allMasters) {
      return this.$q.reject('An error occurred when retrieving build masters');
    }
    switch (type) {
      case BuildServiceType.Jenkins:
        return allMasters.then(masters => masters.filter(master => !(/^travis-/.test(master))));
      case BuildServiceType.Travis:
        return allMasters.then(masters => masters.filter(master => /^travis-/.test(master)));
      default:
        return allMasters;
    }
  }

  public listJobsForMaster(master: string): IPromise<string[]> {
    return this.API.one('v2').one('builds').one(master).one('jobs').get();
  }

  public listBuildsForJob(master: string, job: string): IPromise<IBuild[]> {
    return this.API.one('v2').one('builds').one(master).one('builds').one(job).get();
  }

  public getJobConfig(master: string, job: string): IPromise<IJobConfig> {
    return this.API.one('v2').one('builds').one(master).one('jobs').one(job).get();
  }
}

export const IGOR_SERVICE = 'spinnaker.core.ci.jenkins.igor.service';
module(IGOR_SERVICE, [
  API_SERVICE,
]).factory('igorService', (API: Api, $q: IQService) => new IgorService(API, $q));
