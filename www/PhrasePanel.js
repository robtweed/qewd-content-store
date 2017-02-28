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

"use strict"

var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var Stores = require('./Stores');
var AddStore = require('./AddStore');
var Tags = require('./Tags');
var Phrases = require('./Phrases');
var AddTag = require('./AddTag');
var ReorderPhrases = require('./ReorderPhrases');
var PhraseViewer = require('./PhraseViewer');
var PhraseSearch = require('./PhraseSearch');

var {
  Col
} = ReactBootstrap;

var PhrasePanel = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-PhrasePanel')(this.props.controller, this);
  },

  componentDidMount: function() {
  },
  
  componentWillReceiveProps: function(newProps) {
    //this.onNewProps(newProps);
  },

  componentWillUpdate: function() {
    console.log('Phrase Panel will update...');
    if (this.controller.phraseInsertOverlayOpen) {
      if (this.controller.phraseInsertOverlayOpen.id !== '') {
        this.controller.phraseInsertOverlayOpen.ref.hide();
      }
      delete this.controller.phraseInsertOverlayOpen;
    }
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

    console.log('rendering PhrasePanel');

    if (this.state.status === 'initial') {
      return (<div></div>);
    }

    return (
      <span>
        <Col md={2}>
          <Stores
            controller = {this.controller}
            data = {this.stores}
          />
          <AddStore
            controller = {this.controller}
            data = {this.addStore}
          />
        </Col>
        <Col md={2}>
          <Tags
            controller = {this.controller}
            data = {this.tags}
          />
        </Col>
        <Col md={4}>
          <Phrases
            controller = {this.controller}
            data = {this.phrases}
          />
          <AddTag
            controller = {this.controller}
            data = {this.addTag}
          />
          <ReorderPhrases
            controller = {this.controller}
            data = {this.reorderPhrases}
          />
        </Col>
        <Col md={4}>
          <PhraseViewer
            controller = {this.controller}
            data = {this.phraseViewer}
          />
          <PhraseSearch
            controller = {this.controller}
            data = {this.phraseSearch}
          />
        </Col>
      </span>
    );
  }
});

module.exports = PhrasePanel;
