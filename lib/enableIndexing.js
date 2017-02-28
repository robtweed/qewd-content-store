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

var extractWords = require('./extractWords');

function enableIndexing() {

  var self = this;

  this.documentStore.on('afterSet', function(nodeObj) {

    // maintain indices

    var storeName;
    var phraseId;

    if (nodeObj.documentName === self.contentStoreDocument) {
      //console.log('**** afterSet: ' + JSON.stringify(nodeObj));
      var path = nodeObj.path;
      phraseId = path[1];
      // maintain byTag indices

      if (path[2] === 'byId' && path[4] === 'tags') {

        //console.log('*** for tags');
        storeName = path[1];
        var tag = path[5];
        var phraseId = path[3];
        var contentStoreDoc = new self.documentStore.DocumentNode(nodeObj.documentName, ['store', storeName]);
        contentStoreDoc.$(['byTag', tag, phraseId]).value = '';
        var phraseOrderDoc = contentStoreDoc.$(['byTagInPhraseOrder', tag]);
        if (phraseOrderDoc.exists) {
          //console.log('*** phraseOrderDoc exists so append to end');
          // if new, add the phraseId to the end of the phrases in order document
          var phraseArray = phraseOrderDoc.getDocument(true);
          var index = phraseArray.indexOf(phraseId);
          //console.log('phraseId ' + phraseId + ': index in sort-order array = ' + index);
          if (index === -1) {
            // it's a new phrase so append it to the ordering array
            phraseArray.push(phraseId);
            phraseOrderDoc.delete();
            phraseOrderDoc.setDocument(phraseArray);
            //console.log('new phrase array saved: ' + JSON.stringify(phraseArray));
          }
        }
        return;
      }
      if (path[2] === 'byId' && path[4] === 'uiPhrase') {
        storeName = path[1];
        phraseId = path[3];
        var words = extractWords(nodeObj.value);
        //console.log('words: ' + JSON.stringify(words));
        var contentStoreDoc = new self.documentStore.DocumentNode(nodeObj.documentName, ['store', storeName]);
        words.forEach(function(word) {
          contentStoreDoc.$(['byWord', word, phraseId]).value = '';
        });
      }
      if (path[2] === 'byId' && path[4] === 'authoredPhrase') {
        storeName = path[1];
        phraseId = path[3];
        var contentStoreDoc = new self.documentStore.DocumentNode(nodeObj.documentName, ['store', storeName]);
        contentStoreDoc.$(['byPhrase', nodeObj.value.toLowerCase()]).value = phraseId;
      }
    }
  });
}

module.exports = enableIndexing;
