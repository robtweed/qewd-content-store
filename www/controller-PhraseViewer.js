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

module.exports = function (controller, component) {

  component.phraseObject = component.props.data.phraseObject;
  component.phraseId = component.props.data.phraseId;
  component.storeSelected = component.props.data.storeSelected;
  component.show = component.props.data.show;

  component.editPhrase = function(e) {
    console.log('editing phrase: ' + component.authoredPhrase);
    if (component.authoredPhrase !== component.phraseObject) {
      // phrase has been changed
      controller.send({
        type: 'editPhrase',
        params: {
          id: component.phraseId,
          phrase: component.authoredPhrase
        }
      });
    }
  };

  component.deletePhrase = function(e) {
    console.log('deleting phrase: ' + component.phraseId);
    controller.send({
      type: 'deletePhrase',
      params: {
        id: component.phraseId
      }
    });
  };

  controller.PhraseViewer = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      component[inputObj.ref] = inputObj.value;
    }
  };

  component.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      component.handleSubmit();
    }
  };

  component.handleSubmit = function() {

    if (component.tagName === '') {
      controller.displayError('You must enter a tag name');
      return;
    }

    if (component.phrases === '') {
      controller.displayError('You must enter at least one phrase');
      return;
    }

    // send submit message
    //   response handler subscription is in parent component (PhrasePanel)

    controller.send({
      type: 'addTags',
      params: {
        tag: component.tagName,
        phrases: component.phrases
      }
    });
  };


  component.selectTag = function(e) {
    console.log('id = ' + e.target.id);
    var tag = e.target.id.split('-tagBtn')[0];
    console.log('tag = ' + tag);
    controller.send({
      type: 'selectTag',
      params: {
        tag: tag,
        source: 'PhraseViewer'
      }
    });
  };

  component.switchToTag = function(eventKey) {
    console.log('Switch to Tag: ' + eventKey);
    var tag = eventKey.split('-select')[0];
    controller.send({
      type: 'selectTag',
      params: {
        tag: tag
      }
    });
  };

  component.deleteTagFromPhrase = function(eventKey) {
    console.log('Delete tag: ' + eventKey);
    var tag = eventKey.split('-delete')[0];
    controller.send({
      type: 'deleteTagFromPhrase',
      params: {
        tag: tag
      }
    });
  };

  component.addTagToPhrase = function() {
    console.log('adding ' + component.newTags);
    controller.send({
      type: 'addTagsToPhrase',
      params: {
        tags: component.newTags
      }
    });
  };

  component.openSearch = function() {
    console.log('start phrase search mode');
    controller.emit('startPhraseSearch');
  };


  return controller;
};
