/*

 ----------------------------------------------------------------------------
 | qewd-content-store: Content store using semi-structured free text        |
 |                                                                          |
 | Copyright (c) 2017-18 M/Gateway Developments Ltd,                        |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  5 January 2018

  Main REST endpoint handler function

*/

var router = require('qewd-router');
var routes;
var ContentStore = require('./store')
//var getContentStoreDocument = require('./proto/getContentStoreDocument');

function getContentStore(storeName) {
  if (!storeName || storeName === '') return false;
  var params = {
    documentStore: this.documentStore,
    contentStoreDocument: this.contentStoreDocument,
    contentStoreName: storeName
  };
  return new ContentStore(params);
}

function getTags(args, finished) {

  var contentStore = getContentStore.call(this, args.storeName);

  if (!contentStore.storeExists) {
    finished([]);
    return;
  }
  var tags = contentStore.getTags(1000);
  finished(tags);
}

function getPhrases(args, finished) {

  var contentStore = getContentStore.call(this, args.storeName);
  
  if (!contentStore.storeExists) {
    finished([]);
    return;
  }
  

  var tag = args.req.query.tag;
  var prefix = args.req.query.prefix;
  var search = args.req.query.search;
  var max = args.req.query.max || 50;

  if (!prefix || prefix === '') {
    if (search && search !== '') prefix = search;
  }

  var phrases = contentStore.byTagAndPrefix(tag, prefix, max, 'uiPhrase');
  finished(phrases);
}

function init() {
  routes = [
    {
      url: '/api/contentStore/:storeName/phrases',
      method: 'GET',
      handler: getPhrases
    },
    {
      url: '/api/contentStore/:storeName/tags',
      method: 'GET',
      handler: getTags
    }
  ];
  routes = router.initialise(routes);

  this.contentStoreDocument = this.userDefined.contentStoreDocumentName || 'qewdContentStore';

}

function api(messageObj, finished) {
  var session = {};
  router.process.call(this, messageObj, session, routes, function(results) {
    finished(results);
  });
}


module.exports = {
  init: init,
  api: api,
  getTags: getTags,
  getPhrases: getPhrases
};
