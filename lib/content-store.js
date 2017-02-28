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

var ContentStore = require('./store')
var getContentStoreDocument = require('./proto/getContentStoreDocument');
var rest = require('./rest');

function getContentStore(session) {
  if (session.data.$('storeName').value === '') return false;
  var params = {
    documentStore: this.documentStore,
    contentStoreDocument: this.contentStoreDocument,
    contentStoreName: session.data.$('storeName').value
  };
  return new ContentStore(params);
}

function getTagsAsOptions(session) {
  var contentStore = getContentStore.call(this, session);
  var tags = contentStore.getTags();
  var count = 0;
  var results = [];

  session.data.$('tags').delete();

  tags.forEach(function(tag) {
    results.push({
      value: count,
      label: tag
    });
    count++;
    session.data.$(['tags', tag]).value = '';
  });
  return {
    delimiters: contentStore.delimiters,
    options: results
  };
}

function getStoreNames() {
  var storeNames = [];
  var contentStoreDoc = new this.documentStore.DocumentNode(this.contentStoreDocument, ['store']);
  contentStoreDoc.forEachChild(function(storeName) {
    storeNames.push(storeName);
  });
  return storeNames;
}

function digest(string) {
  // encrypt password
  return string;
}

String.prototype.replaceAll = function(str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

module.exports = {

  store: ContentStore,

  rest: rest,

  init: function() {
    var enableIndexing = require('./enableIndexing');
    enableIndexing.call(this);
    //console.log('*** indexing module loaded for content-store into ' + process.pid);
    this.contentStoreDocument = this.userDefined.contentStoreDocumentName || 'qewdContentStore';
  },

  servicesAllowed: {
  },

  handlers: {
    login: function(messageObj, session, send, finished) {
      var password = messageObj.params.password;
      if (!password || password === '') {
        finished({error: 'You must enter a password'});
        return;
      }

      var credentialsDoc = new this.documentStore.DocumentNode(this.contentStoreDocument, ['user']);

      if (!credentialsDoc.exists) {
        // no authentication database set up, so use QEWD management password

        if (password === this.userDefined.config.managementPassword) {
          session.timeout = 20 * 60;
          session.authenticated = true;
          finished({ok: true});    
        }
        else {
          finished({error: 'Invalid login attempt'});
        }
        return;
      }
      else {
        var username = messageObj.params.username;
        if (!username || username === '') {
          finished({error: 'You must enter a username'});
          return;
        }
        var userCredentials = credentialsDoc.$(username);
        if (!userCredentials.exists) {
          // username not recognised
          finished({error: 'Invalid login attempt'});
          return;
        }
        if (digest(password) !== userCredentials.$('password').value) {
          // username ok but wrong password
          finished({error: 'Invalid login attempt'});
          return;
        }
        session.timeout = 20 * 60;
        session.authenticated = true;
        finished({ok: true});
        return;
      }
    },
    getContentStores: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var storeNames = getStoreNames.call(this);
      var results = [];
      var sessionStores = session.data.$('stores');
      sessionStores.delete();
      var count = 0;
      storeNames.forEach(function(storeName) {
        results.push({
          value: count,
          label: storeName
        });
        sessionStores.$(count).value = storeName;
        count++;
      });
      finished(results);
    },

    selectStore: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var storeNo = messageObj.params.store;
      var storeName = session.data.$(['stores', storeNo]).value;
      if (storeName === '') {
        finished({error: 'Unable to identify that store'});
        return;
      }

      session.data.$('storeName').value = storeName;

      var results = getTagsAsOptions.call(this, session);

      finished({
        storeNo: storeNo,
        storeName: storeName,
        tags: results.options,
        delimiters: results.delimiters
      });
    },

    saveStore: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var storeName = messageObj.params.storeName;
      if (storeName === '') {
        finished({error: 'You must enter a Store name'});
        return;
      }

      var params = {
        documentStore: this.documentStore,
        contentStoreDocument: this.contentStoreDocument,
        contentStoreName: storeName
      };
      var contentStore = new ContentStore(params);

      // Store name

      //console.log('saveStore - contentStore = ' + JSON.stringify(contentStore));

      if (contentStore.storeExists) {
        finished({error: 'The specified Store name is already in use'});
        return;
      }

      // Subject delimiters

      var subjectDelimiters = messageObj.params.subjectDelimiters;
      if (subjectDelimiters === '' || subjectDelimiters.length !== 2) {
        finished({error: 'You must enter L&R Subject delimiters, eg ~~'});
        return;
      }

      // Value delimiters

      var valueDelimiters = messageObj.params.valueDelimiters;
      if (valueDelimiters === '' || valueDelimiters.length !== 2) {
        finished({error: 'You must enter L&R Value delimiters, eg ||'});
        return;
      }

      // Unit delimiters

      var unitDelimiters = messageObj.params.unitDelimiters;
      if (unitDelimiters === '' || unitDelimiters.length !== 2) {
        finished({error: 'You must enter L&R Unit delimiters, eg {}'});
        return;
      }

      if (subjectDelimiters === valueDelimiters || subjectDelimiters === unitDelimiters || valueDelimiters === unitDelimiters) {
        finished({error: 'Subject, Value and Unit delimiters must be different'});
        return;
      }

      var data = {
        delimiters: {
          subject: { 
            left: subjectDelimiters[0],
            right: subjectDelimiters[1],
          },
          value: {
            left: valueDelimiters[0],
            right: valueDelimiters[1],
          },
          unit: {
            left: unitDelimiters[0],
            right: unitDelimiters[1],
          }
        }
      };

      contentStore.delimiters = data;

      finished({ok: true});
    },

    selectTag: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var tagName = messageObj.params.tag;
      if (tagName === '' || !session.data.$(['tags', tagName]).exists) {
        finished({error: 'Invalid tag: ' + tagName});
        return;
      }

      session.data.$('selectedTag').value = tagName;

      var contentStore = getContentStore.call(this, session);
      if (!contentStore) {
        finished({error: 'Unable to identify the Content Store'});
        return;
      }
      var phrases = contentStore.byTagAndPrefix(tagName, null, 1000, 'authoredPhrase');

      var results = [];
      var sessionPhrases = session.data.$('phrases');
      sessionPhrases.delete();

      phrases.forEach(function(phrase) {
        results.push({
          value: phrase.id,
          label: phrase.phrase
        });
        sessionPhrases.$(phrase.id).value = phrase.phrase;
      });
      finished({
        tagValue: messageObj.params.no,
        tagName: tagName,
        phrases: results
      });
    },

    getAllPhrasesByTags: function(messageObj, session, send, finished) {
      finished([]);
    },

    addTags: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var tags = messageObj.params.tag.replaceAll(' ','');  // remove any spaces
      tags = tags.toLowerCase().split(',');
      var phrases = messageObj.params.phrases.split('\n');
      var contentStore = getContentStore.call(this, session);
      var result = contentStore.create(phrases, tags);
      var results = getTagsAsOptions.call(this, session);
      finished({
        tagName: tags[0],
        tags: results.options
      });
    },

    changePhraseOrder: function(messageObj, session, send, finished) {
      var tagName = messageObj.params.tagName;
      var phraseIdArray = messageObj.params.phraseIdArray;
      var contentStore = getContentStore.call(this, session);
      var result = contentStore.setPhraseOrder(phraseIdArray, tagName);
      finished({ok: true});
      /*

      // return the phrases as options in their new sequence
      var phrases = contentStore.byTagAndPrefix(tagName, null, 1000, 'authoredPhrase');
      var results = [];
      phrases.forEach(function(phrase) {
        results.push({
          value: phrase.id,
          label: phrase.phrase
        });
      });
      finished(results);
      */
    },

    selectPhrase: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var contentStore = getContentStore.call(this, session);
      var phraseId = messageObj.params.phrase;
      if (phraseId === '' || !contentStore.phraseIdExists(phraseId)) {
        finished({error: 'Invalid phrase identifier'});
        return;
      }
      session.data.$('selectedPhrase').value = phraseId;
      finished({
        id: phraseId,
        phrase: contentStore.get(phraseId, '_all')
      });
    },

    deleteTagFromPhrase: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var tag = messageObj.params.tag;
      var phraseId = session.data.$('selectedPhrase').value;
      var contentStore = getContentStore.call(this, session);
      contentStore.removeTagFromPhrase(phraseId, tag);
      finished({
        tag: tag,
        tagExists: contentStore.tagExists(tag)
      });
    },

    addTagsToPhrase: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var tags = messageObj.params.tags.replaceAll(' ','');  // remove any spaces
      tagArr = tags.toLowerCase().split(',');
      var phraseId = session.data.$('selectedPhrase').value;
      //console.log('adding ' + JSON.stringify(tagArr) + ' to phrase ' + phraseId);
      var contentStore = getContentStore.call(this, session);
      var result = contentStore.addTagsToPhrase(phraseId, tagArr);
      finished(result);
    },

    deletePhraseFromTag: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var phraseId = messageObj.params.phrase;
      var tag = session.data.$('selectedTag').value;
      var contentStore = getContentStore.call(this, session);
      contentStore.removeTagFromPhrase(phraseId, tag);
      finished({
        tag: tag,
        tagExists: contentStore.tagExists(tag)
      });
    },

    editPhrase: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var phraseId = messageObj.params.id;
      var phrase = messageObj.params.phrase;
      var contentStore = getContentStore.call(this, session);
      contentStore.editPhrase(phraseId, phrase);
      finished({
        ok: true
      });
    },

    insertPhrase: function(messageObj, session, send, finished) {
      var targetPhraseId = messageObj.params.targetPhraseId;
      var phrase = messageObj.params.phrase;
      if (phrase === '') {
        finished({error: 'You must enter a phrase'});
        return;
      }
      var tag = session.data.$('selectedTag').value;
      var contentStore = getContentStore.call(this, session);
      var phraseOrder = contentStore.getPhraseOrder(tag);
      contentStore.addPhraseToStore(phrase, [tag]);
      var newPhraseId = contentStore.getPhraseId(phrase);
      var index = phraseOrder.indexOf(targetPhraseId);
      phraseOrder.splice(index, 0, newPhraseId);
      contentStore.setPhraseOrder(phraseOrder, tag);
      var phrases = contentStore.byTag(tag, 1000, 'authoredPhrase');
      var results = [];
      phrases.forEach(function(phrase) {
        results.push({
          value: phrase.id,
          label: phrase.phrase
        });
      });
      finished({
        targetPhraseId: targetPhraseId,
        options: results
      });
    },

    deletePhrase: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var phraseId = messageObj.params.id;
      var contentStore = getContentStore.call(this, session);
      contentStore.deletePhrase(phraseId);

      // does currently-selected tag still exist?

      var tag = session.data.$('selectedTag').value;

      finished({
        ok: true,
        tagExists: contentStore.tagExists(tag)
      });
    },

    getPhrasesByPrefix: function(messageObj, session, send, finished) {
      if (!session.authenticated) {
        finished({error: 'Invalid request'});
        return;
      }
      var prefix = messageObj.params.prefix;
      var contentStore = getContentStore.call(this, session);
      var matches = contentStore.byPrefix(prefix);
      var results = [];
      matches.forEach(function(item) {
        results.push({
          value: item.id,
          label: item.phrase
        });
      });
      finished({
        prefix: prefix,
        options: results
      });
    }

  }
};


