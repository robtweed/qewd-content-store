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

  7 February 2017

*/

function arrayMove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

module.exports = function (controller, component) {

  component.show = component.props.data.show;
  component.options = component.props.data.options;
  component.tagName = component.props.data.tagName;

  component.cancel = function() {
    controller.emit('cancelReorderPhrases');
  };

  component.onReorder = function(e, itemThatHasBeenMoved, itemsPreviousIndex, itemsNewIndex, reorderedArray) {
    console.log('onReorder: ');
    console.log('itemThatHasBeenMoved: ' + itemThatHasBeenMoved);
    console.log('itemsPreviousIndex: ' + itemsPreviousIndex);
    console.log('itemsNewIndex: ' + itemsNewIndex);

    // Modify the phrase order array appropriately
    arrayMove(component.phraseOrder, itemsPreviousIndex, itemsNewIndex);
    console.log('phraseOrder: ' + JSON.stringify(component.phraseOrder));

    // send off new sequence to the back-end.  No need for response handling - just fire and forget
    controller.send({
      type: 'changePhraseOrder',
      params: {
        tagName: component.tagName,
        phraseIdArray: component.phraseOrder
      }
    });
  };


  return controller;
};
