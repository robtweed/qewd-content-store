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

  21 February 2017

*/

var extractWords = require('.././extractWords');
var parsePhrase = require('./parsePhrase');

function editPhrase(phraseId, newPhrase) {
  if (!phraseId || phraseId === '') return false;

  var phraseObj = this.get(phraseId, '_all');

  // remove the current word index

  var byWordDoc = this.contentStoreDoc.$('byWord');

  var words = extractWords(phraseObj.authoredPhrase);
  words.forEach(function(word) {
    byWordDoc.$([word, phraseId]).delete();
  });

  var tag;

  // remove the current phrase index
  var lcPhrase = phraseObj.authoredPhrase.toLowerCase();
  this.contentStoreDoc.$(['byPhrase', lcPhrase]).delete();

  lcPhrase = newPhrase.toLowerCase();
  var byPhraseDoc = this.contentStoreDoc.$(['byPhrase', lcPhrase]);
  if (byPhraseDoc.exists) {
    // the new phrase matches one that already exists - merge them together into this id
    var otherPhraseId = byPhraseDoc.value;

    //  the tags for the other phrase must be grabbed and merged with this new one
    //  then delete the old tag

    //   then proceed to create this new tag with its indices

    var otherPhraseObj = this.get(otherPhraseId, '_all');
    for (tag in otherPhraseObj.tags) {
      phraseObj.tags[tag] = '';
    }

    this.deletePhrase(otherPhraseId);

  }

    // create the new phrase index
    byPhraseDoc.value = phraseId;

    // parse the new phrase
    var newPhraseObj = parsePhrase.call(this, newPhrase);

    // copy across the current tags

    newPhraseObj.tags = {};
    for (tag in phraseObj.tags) {
      newPhraseObj.tags[tag] = '';
    }

    // now update the main record
    var byIdDoc = this.contentStoreDoc.$(['byId', phraseId]);
    byIdDoc.delete();
    byIdDoc.setDocument(newPhraseObj);
    // the new word index will get automatically created by the indexing event handler
    return {
      ok: true,
      id: phraseId
    };
}

module.exports = editPhrase;
