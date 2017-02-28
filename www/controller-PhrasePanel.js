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

  9 February 2017

*/

module.exports = function (controller, component) {

  controller.on('getContentStores', function(responseObj) {
    component.stores.options = responseObj.message;
    component.setState({
      status: 'fetchedStores'
    });
  });


  controller.on('selectStore', function(responseObj) {
    console.log('store selected - results: ' + JSON.stringify(responseObj));
    component.stores.selectedValue = responseObj.message.storeNo;
    component.stores.selectedName = responseObj.message.storeName;
    component.stores.delimiters = responseObj.message.delimiters;
    component.stores.documentName = responseObj.message.documentName;

    component.tags.options = responseObj.message.tags;
    component.tags.storeName = responseObj.message.storeName;

    component.phraseViewer.storeSelected = true;

    component.setState({
      status: 'fetchedTags'
    });
  });

  controller.on('addStore', function() {
    console.log('add a new store');
    
    component.stores.show = false;
    component.addStore.show = true;

    component.setState({
      status: 'addStore'
    });

  });

  controller.on('saveStore', function(responseObj) {
    if (!responseObj.message.error) {
      component.stores.show = true;
      component.addStore.show = false;

      controller.send({
        type: 'getContentStores'
      });
    }
  });
    
  controller.on('selectTag', function(responseObj) {
    console.log('** tag selected - results: ' + JSON.stringify(responseObj));
    //console.log('** tag options: ' + JSON.stringify(component.tags.options));

    if (responseObj.message.tagValue) {
      component.tags.selectedValue = responseObj.message.tagValue;
    }
    else {
      var option;
      for (var i = 0; i < component.tags.options.length; i++) {
         option = component.tags.options[i];
         if (option.label === responseObj.message.tagName) {
           component.tags.selectedValue = option.value;
           break;
         }
      }
    }
    component.tags.selectedName = responseObj.message.tagName;

    component.phrases.options = responseObj.message.phrases;
    component.phrases.selectedTagName = responseObj.message.tagName;
    component.phrases.show = true;
    component.reorderPhrases.show = false;


    component.addTag.show = false;

    component.setState({
      status: 'fetchedPhrases'
    });
  });

  controller.on('addTagsToPhrase', function(responseObj) {

    // new tag added - need to update the Tags menu

    // existing tag added - no need to change anything

    //  we DO need to re-display the phrase in the PhraseView panel

    component.reorderPhrases.show = false;
    component.phrases.show = true;

    if (responseObj.message.newTag) { 
      controller.send({
        type: 'selectStore',
        params: {
          store: component.stores.selectedValue
        }
      });
    }

    // update the phrases on display as the phrase may have been added to the currently-selected tag

    controller.send({
      type: 'selectTag',
      params: {
        tag: component.tags.selectedName,
        no: component.tags.selectedValue
      }
    });    

    controller.send({
      type: 'selectPhrase',
      params: {
        phrase: component.phraseViewer.phraseId
      }
    });
  });

  controller.on('deletePhraseFromTag', function(responseObj) {
    controller.emit('deleteTagFromPhrase', responseObj);
  });

  controller.on('deleteTagFromPhrase', function(responseObj) {
    console.log('deleteTagFromPhrase - results: ' + JSON.stringify(responseObj));

    if (responseObj.message.tagExists) {

      // The deleted tag still has other phrases associated with it

      if (responseObj.message.tag === component.tags.selectedName) {
        // the deleted tag is the one we'd selected in the Tags menu so
        //  we need to re-fetch and re-render the phrases for that tag

        component.phrases.show = true;
        component.reorderPhrases.show = false;

        controller.send({
          type: 'selectTag',
          params: {
            tag: component.tags.selectedName,
            no: component.tags.selectedValue
          }
        });
      }
      // otherwise leave the tags and phrases alone - it was a different
      //  tag that was deleted
    }
    else {
      // The tag that was deleted no longer has any phrases associated with it
      // If it was the one that was currently selected, re-draw the Tags panel
      //  and show nothing currently selected
      // and clear the Phrases panel

      if (responseObj.message.tag === component.tags.selectedName) {

        component.tags.selectedName = '';
        component.tags.selectedValue = '';

        component.phrases = {
          selectedTagName: '',
          options: [],
          show: true
        };
      }
      else {
        // don't do anything - when the tag menu is re-fetched and re-rendered,
        //  it will still have the current tag selected and the phrases for that
        //  tag will remain in the phrase panel

        //  also leave the current phrase still in view

      }

      // re-selecting the current store will re-fetch and draw the tags menu

      controller.send({
        type: 'selectStore',
        params: {
          store: component.stores.selectedValue
        }
      });  
    }

    // we also need to re-fetch and re-render the phrase in the viewer panel
    //  to show it's reduced set of tags

    if (component.phraseViewer.phraseId !== '') {

      controller.send({
        type: 'selectPhrase',
        params: {
          phrase: component.phraseViewer.phraseId
        }
      });
    }

  });

  controller.on('insertPhrase', function(responseObj) {
    console.log('new phrase has been inserted');
    
    component.phrases.options = responseObj.message.options;

    component.setState({
      status: 'phraseInserted'
    });

  });

  controller.on('addTag', function(tagName) {
    console.log('*** addTag event fired in controller-PhrasePanel: tagName = ' + tagName);
    if (typeof tagName === 'object') tagName = '';
    component.addTag.show = true;
    component.phrases.show = false;
    component.reorderPhrases.show = false;
    component.addTag.tagName = tagName || '';
    component.setState({
      status: 'addTag'
    });
  });

  controller.on('cancelAddTag', function() {
    component.phrases.show = true;
    component.addTag.show = false;
    component.reorderPhrases.show = false;

    component.setState({
      status: 'cancelAddTag'
    });

  });

  controller.on('reorderPhrases', function(data) {

    console.log('controller-PhrasePanel on reorderPhrases: ' + JSON.stringify(data));

    component.addTag.show = false;
    component.phrases.show = false;
    component.reorderPhrases.show = true;
    component.reorderPhrases.tagName = data.tagName;
    component.reorderPhrases.options = data.options;
    component.setState({
      status: 'reorderPhrases'
    });
  });

  controller.on('cancelReorderPhrases', function() {
    component.phrases.show = true;
    component.addTag.show = false;
    component.reorderPhrases.show = false;

    if (component.reorderPhrases.changed) {
      component.reorderPhrases.changed = false;
      // re-fetch phrases
      controller.send({
        type: 'selectTag',
        params: {
          tag: component.tags.selectedName,
          no: component.tags.selectedValue
        }
      });
    }
    else {
      component.setState({
        status: 'cancelReorderPhrases'
      });
    }

  });

  controller.on('changePhraseOrder', function(responseObj) {
    component.reorderPhrases.changed = true;

    /*
    // leave the UI showing the re-order phrase screen
    //component.addTag.show = false;
    //component.phrases.show = true;
    //component.reorderPhrases.show = false;

    component.phrases.options = responseObj.message; // newly-ordered phrases
    component.setState({
      status: 'changePhraseOrder'
    });
    */
  });

  controller.on('addTags', function(responseObj) {
    console.log('handling addTags response');
    component.addTag.show = false;
    component.phrases.show = true;
    component.reorderPhrases.show = false;

    var options = responseObj.message.tags;
    var tagName = responseObj.message.tagName;
    component.tags.options = options;

    if (component.tags.selectedValue === '' && tagName && tagName !== '') {
      // find the tag in the options array to obtain its value
      var tagValue;
      for (var i = 0; i < options.length; i++) {
        if (tagName === options[i].label) {
          tagValue = options[i].value;
        }
      }

      component.tags.selectedName = tagName;
      component.tags.selectedValue = tagValue;
    }

    if (component.tags.selectedValue !== '') {
      // re-fetch / re-display the phrases for this tag as they may have been added to
      controller.send({
        type: 'selectTag',
        params: {
          tag: component.tags.selectedName,
          no: component.tags.selectedValue
        }
      });
    }
    else {
      // at least re-render the tag list with any new values
      component.setState({
        status: 'addTags'
      });
    }

  });

  controller.on('selectPhrase', function(responseObj) {
    component.addTag.show = false;
    component.phrases.show = true;
    component.reorderPhrases.sho = false;
    component.phraseSearch.show = false;

    component.phraseViewer.show = true;
    component.phraseViewer.phraseId = responseObj.message.id
    component.phraseViewer.phraseObject = responseObj.message.phrase

    component.setState({
      status: 'selectPhrase'
    });
  });

  controller.on('editPhrase', function(responseObj) {

    component.addTag.show = false;
    component.phrases.show = true;
    component.reorderPhrases.show = false;

    // re-fetch phrases panel and phraseView panel

    //  note - if the phrase was changed to one that already exists, 
    //   the matching one will have been merged and deleted, so the
    //   edited phrase could now have new tags

    controller.send({
      type: 'selectTag',
      params: {
        tag: component.tags.selectedName,
        no: component.tags.selectedValue
      }
    });

    controller.send({
      type: 'selectPhrase',
      params: {
        phrase: component.phraseViewer.phraseId
      }
    });
    

  });

  controller.on('deletePhrase', function(responseObj) {

    component.addTag.show = false;
    component.phrases.show = true;
    component.reorderPhrases.show = false;

    if (responseObj.message.tagExists) {
      // there are still phrases for the selected tag so refresh the phrases

      // remove from phraseViewer

      component.phraseViewer.phraseId = '';
      component.phraseViewer.phraseObject = '';

      controller.send({
        type: 'selectTag',
        params: {
          tag: component.tags.selectedName,
          no: component.tags.selectedValue
        }
      });
    }
    else {
      // the selected tag is no more, so de-select it

      component.tags.selectedName = '';
      component.tags.selectedValue = '';

      component.phrases = {
        selectedTagName: '',
        options: [],
        show: true
      };

      // remove from phraseViewer

      component.phraseViewer.phraseId = '';
      component.phraseViewer.phraseObject = '';

      // re-selecting the current store will re-fetch and draw the tags menu with the reduced list of tags

      controller.send({
        type: 'selectStore',
        params: {
          store: component.stores.selectedValue
        }
      });  
    }



    component.setState({
      status: 'deletePhrase'
    });
  });

  controller.on('startPhraseSearch', function(responseObj) {
    component.phraseViewer.show = false;
    component.phraseSearch.show = true;
    component.phraseSearch.prefix = '';
    component.phraseSearch.options = [];

    component.setState({
      status: 'startPhraseSearch'
    });

  });

  controller.on('cancelAddStore', function(responseObj) {
    component.stores.show = true;
    component.addStore.show = false;

    component.setState({
      status: 'cancelAddStore'
    });

  });

  controller.on('cancelPhraseSearch', function(responseObj) {
    component.phraseViewer.show = true;
    component.phraseSearch.show = false;

    component.setState({
      status: 'cancelPhraseSearch'
    });

  });

  controller.on('getPhrasesByPrefix', function(responseObj) {

    component.phraseSearch.options = responseObj.message.options;
    component.phraseSearch.prefix = responseObj.message.prefix;
    component.setState({
      status: 'newPhraseMatches'
    });
  });


  // Initialise....

  component.stores = {
    show: true,
    selectedValue: '',
    selectedName: '',
    options: [],
    delimiters: {}
  };

  component.addStore = {
    show: false
  };

  component.tags = {
    storeName: '',
    selectedValue: '',
    selectedName: '',
    options: []
  };

  component.phrases = {
    selectedTagName: '',
    options: [],
    show: true
  };

  component.addTag = {
    show: false,
    subjectDelimiters: '~~',
    valueDelimiters: '||',
    unitDelimiters: '{}'
  };

  component.reorderPhrases = {
    show: false,
    options: [],
    tagName: '',
    changed: false
  };

  component.phraseViewer = {
    show: true,
    storeSelected: false,
    phraseId: '',
    phraseObject: {}
  };

  component.phraseSearch = {
    show: false,
    options: [],
    prefix: ''
  };

  // start it up by fetching the current stores

  controller.send({
    type: 'getContentStores'
  });

  return controller;
};
