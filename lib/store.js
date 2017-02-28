/*

 ----------------------------------------------------------------------------
 | qewd-content-store: Content store using semi-structured free text        |
 |                                                                          |
 | Copyright (c) 2017 M/Gateway Developments Ltd,                           |
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

  3 February 2017

*/

var getContentStoreDocument = require('./proto/getContentStoreDocument');

String.prototype.replaceAll = function(str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

var ContentStore = function(params) {

  this.documentStore = params.documentStore;
  this.contentStoreDocument = params.contentStoreDocument || 'qewdContentStore'; // the global used for the Document Store
  this.contentStoreName = params.contentStoreName || 'contentStore';

  this.contentStoreDoc = getContentStoreDocument(this);

  this.maxMatches = params.maxMatches || 50;

}

var proto = ContentStore.prototype;

Object.defineProperty(proto, 'delimiters', require('./proto/delimiters'));
Object.defineProperty(proto, 'storeExists', require('./proto/exists'));

proto.create = require('./proto/create');
proto.get = require('./proto/get');
proto.byTag = require('./proto/byTag');
proto.byPrefix = require('./proto/byPrefix');
proto.byTagAndPrefix = require('./proto/byTagAndPrefix');
proto.phraseHasTag = require('./proto/phraseHasTag');
proto.getTags = require('./proto/getTags');
proto.tagExists = require('./proto/tagExists');
proto.phraseExists = require('./proto/phraseExists');
proto.getPhraseId = require('./proto/getPhraseId');
proto.phraseIdExists = require('./proto/phraseIdExists');
proto.getPhraseOrder = require('./proto/getPhraseOrder');
proto.removeTagFromPhrase = require('./proto/removeTagFromPhrase');
proto.addPhraseToStore = require('./proto/addPhraseToStore');
proto.addTagsToPhrase = require('./proto/addTagsToPhrase');
proto.addTagToPhrase = require('./proto/addTagToPhrase');
proto.deletePhrase = require('./proto/deletePhrase');
proto.editPhrase = require('./proto/editPhrase');
proto.setPhraseOrder = require('./proto/setPhraseOrder');

module.exports = ContentStore;

