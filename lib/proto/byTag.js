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

function byTag(tag, max, property) {
  var results = [];
  if (!tag || tag === '') return results;
  max = max || this.maxMatches;
  tag = tag.toString().toLowerCase();
  var count = 0;
  var self = this;

  var tagDoc = this.contentStoreDoc.$(['byTag', tag]);
  var phraseOrderDoc = this.contentStoreDoc.$(['byTagInPhraseOrder', tag]);

  if (phraseOrderDoc.exists) {
    // return the phrases for the tag in the order specified by the author
    var phraseArray = phraseOrderDoc.getDocument(true);
    var id;
    for (var i = 0; i < phraseArray.length; i++) {
      id = phraseArray[i];
      results.push({
        id: id,
        phrase: self.get(id, property)
      });
      count++;
      if (count === max) break;  // stop the loop
    }
    return results;
  }

  tagDoc.forEachChild(function(id) {
    results.push({
      id: id,
      phrase: self.get(id, property)
    });
    count++;
    if (count === max) return true;  // stop the loop
  });
  return results;
}

module.exports = byTag;
