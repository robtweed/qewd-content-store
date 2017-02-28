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

function getElement(phrase, elementName) {

  var delimStart = this.delimiters[elementName].left;
  var delimEnd = this.delimiters[elementName].right;

  //console.log(phrase + '; ' + elementName + '; ' + delimStart + '; ' + delimEnd);
  if (elementName === 'subject' && phrase.indexOf(delimStart) === -1) {
    // no subject delimiters, so entire phrase is subject
    return {
      element: phrase,
      phrase: phrase
    };
  }
  if (phrase.indexOf(delimStart) === -1 && phrase.indexOf(delimEnd) === -1) {
    // the element isn't defined in the phrase
    return {
      phrase: phrase
    };
  }
  var result;
  var pieces = phrase.split(delimStart);
  if (delimStart === delimEnd) {
    result = {
      element: pieces[1],
      phrase: pieces[0] + '[[:' + elementName + ']]' + pieces[2]
    };
    return result;
  }
  var subPieces = pieces[1].split(delimEnd);
  var element = subPieces[0];
  result = {
    element: element,
    phrase: pieces[0] + '[[:' + elementName + ']]' + subPieces[1]
  };
  return result;
}

module.exports = getElement;
