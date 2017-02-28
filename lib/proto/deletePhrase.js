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

var extractWords = require('.././extractWords');

function deletePhrase(phraseId) {
  if (!phraseId || phraseId === '') return false;

  var phraseObj = this.get(phraseId, '_all');

  var self = this;
  for (var tag in phraseObj.tags) {
    console.log('removing tag ' + tag);
    self.removeTagFromPhrase(phraseId, tag);
  };

  var byWordDoc = this.contentStoreDoc.$('byWord');

  var words = extractWords(phraseObj.authoredPhrase);
  words.forEach(function(word) {
    byWordDoc.$([word, phraseId]).delete();
  });

  var lcPhrase = phraseObj.authoredPhrase.toLowerCase();

  this.contentStoreDoc.$(['byPhrase', lcPhrase]).delete();
  this.contentStoreDoc.$(['byId', lcPhrase]).delete();

  return true;
}

module.exports = deletePhrase;
