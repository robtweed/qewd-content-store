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

function byTagAndPrefix(tag, prefix, max, property) {
  var results = [];
  tag = tag || '';
  prefix = prefix || '';

  if (tag === '' && prefix == '') return results;

  if (prefix === '') return this.byTag(tag, max, property);
  if (tag === '') return this.byPrefix(prefix, max, property);

  max = max || this.maxMatches;
  tag = tag.toString().toLowerCase();
  prefix = prefix.toString().toLowerCase();

  var indexDoc = this.contentStoreDoc.$('byWord')
  var tagIndex = this.contentStoreDoc.$(['byTag', tag]);

  var params = {
    prefix: prefix
  };
  var results = [];
  var idFound = {};
  var count = 0;
  var self = this;
  indexDoc.forEachChild(params, function(index, childNode) {
    childNode.forEachChild(function(id) {
      if (!idFound[id]) {
        //console.log('** property = ' + property);
        if (tagIndex.$(id).exists) {
          idFound[id] = true;
          count++;
          if (count === max) return true;
        }
      }
    });
    if (count === max) return true;
  });
  
  var id;
  var tagOrder = this.contentStoreDoc.$(['byTagInPhraseOrder', tag]);
  if (tagOrder.exists) {
    tagOrder.forEachChild(function(position, childNode) {
      var id = childNode.value;
      if (idFound[id]) {
        results.push({
          id: id,
          phrase: self.get(id, property)
        });
      }
    });
  }
  else {
    for (id in idFound) {
      results.push({
        id: id,
        phrase: self.get(id, property)
      });
    }
  }

  return results;
}

module.exports = byTagAndPrefix;
