/*

 ------------------------------------------------------------------------------------
 | qewd-monitor: React.js-based Monitor/Management Application for QEWD             |
 |                                                                                  |
 | Copyright (c) 2017 M/Gateway Developments Ltd,                                   |
 | Reigate, Surrey UK.                                                              |
 | All rights reserved.                                                             |
 |                                                                                  |
 | http://www.mgateway.com                                                          |
 | Email: rtweed@mgateway.com                                                       |
 |                                                                                  |
 |                                                                                  |
 | Licensed under the Apache License, Version 2.0 (the "License");                  |
 | you may not use this file except in compliance with the License.                 |
 | You may obtain a copy of the License at                                          |
 |                                                                                  |
 |     http://www.apache.org/licenses/LICENSE-2.0                                   |
 |                                                                                  |
 | Unless required by applicable law or agreed to in writing, software              |
 | distributed under the License is distributed on an "AS IS" BASIS,                |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.         |
 | See the License for the specific language governing permissions and              |
 |  limitations under the License.                                                  |
 ------------------------------------------------------------------------------------

  3 January 2016

*/

module.exports = function (controller, component) {

  component.onNewProps = function(newProps) {
  };

  component.selectPhrase = function() {
    var message = {
      type: 'selectPhrase',
      params: {
        phrase: component.props.id
      }
    };
    controller.send(message);
  };

  component.deletePhraseFromTag = function() {
    var message = {
      type: 'deletePhraseFromTag',
      params: {
        phrase: component.props.id
      }
    };
    controller.send(message);
  };

  component.closePopover = function() {
    if (controller.phraseInsertOverlayOpen && controller.phraseInsertOverlayOpen.id !== '') {
      controller.phraseInsertOverlayOpen.ref.hide();
    }
  };

  component.overlayOpen = function() {
    console.log('overlayOpen');
    var ref;
    if (controller.phraseInsertOverlayOpen && controller.phraseInsertOverlayOpen.id !== '') {
      ref = controller.phraseInsertOverlayOpen.ref;
      console.log('overlayOpen: closed');
    }
    controller.phraseInsertOverlayOpen = {
      ref: component.refs['overlay-ref-' + component.props.id],
      id: component.props.id
    };
    if (ref) ref.hide();
    console.log('overlayOpen: open');
  };

  component.overlayClosed = function() {
    console.log('overlayClosed: closed');
    if (controller.phraseInsertOverlayOpen && controller.phraseInsertOverlayOpen.id === component.props.id) {
      controller.phraseInsertOverlayOpen.id = '';
      console.log('id set empty');
    }
  };

  component.insertPhrase = function() {
    console.log('*** insert phrase will now send');

    component.refs['overlay-ref-' + component.props.id].hide();
    delete controller.phraseInsertOverlayOpen;

    if (controller.PhraseTableRow.newPhrase === '') {
      controller.displayError('You did not enter a phrase');
      return;
    }

    controller.send({
      type: 'insertPhrase',
      params: {
        targetPhraseId: component.props.id,
        phrase: controller.PhraseTableRow.newPhrase
      }
    });
  };

  controller.PhraseTableRow = {
    newPhrase: '',
    onFieldChange: function(inputObj) {
      console.log('xxxonFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      component[inputObj.ref] = inputObj.value;
      controller.PhraseTableRow.newPhrase = inputObj.value;
    }
  };

  return controller;
};
