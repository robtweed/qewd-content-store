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

var parsePhrase = require('./parsePhrase');

function addPhraseToStore(phrase, tags) {
  // add a new stored phrase record to the Content Store
  //  indexing is done via events;

  var phraseObj = parsePhrase.call(this, phrase);
  var lcPhrase = phraseObj.authoredPhrase.toLowerCase();

  var phrasesById = this.contentStoreDoc.$('byId');
  var phraseId = this.contentStoreDoc.$(['byPhrase', lcPhrase]).value;
  if (phraseId !== '') {
    //console.log('*** ' + lcPhrase + ' already exists as ' + phraseId);
    // this phrase has already been created - just save & index/re-index any new tags
    var tagsDoc = phrasesById.$([phraseId, 'tags']);
    var tagDoc;    

    tags.forEach(function(tag) {
      tagDoc = tagsDoc.$(tag);
      if (!tagDoc.exists) {
        tagDoc.value = '';
      }
    });
    return true;
  }

  //console.log('*** ' + lcPhrase + ' is a new phrase');

  phraseObj.tags = {};
  tags.forEach(function(tag) {
    var lcTag = tag.toString().toLowerCase();
    phraseObj.tags[lcTag] = '';
  })

  phraseId = this.contentStoreDoc.$('phraseIdCounter').increment();
  phrasesById.$(phraseId).setDocument(phraseObj);
  return true;
}

module.exports = addPhraseToStore;
