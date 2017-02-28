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
var Select = require('react-select');
var FormField = require('./FormField');

var {
  Button,
  Dropdown,
  MenuItem,
  Panel
} = ReactBootstrap;

var PhraseSearch = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial',
      tagValue: ''
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-PhraseSearch')(this.props.controller, this);
    this.title = (
      <span>
          <b>Search for a Phrase</b>
          <Button 
            bsClass="btn btn-primary pull-right"
            onClick = {this.cancel}
          >
            Cancel
          </Button>
      </span>
    );
  },

  componentWillReceiveProps: function(newProps) {
    console.log('PhraseSearch receiving new props: ' + JSON.stringify(newProps));
    this.show = newProps.data.show;
    this.options = newProps.data.options;
    this.prefix = newProps.data.prefix || '';
  },


  render: function() {

    console.log('Rendering PhraseSearch');
    
    var display = '';
    if (!this.show) display = 'hidden';

    return (
      <div
        className = {display}
      >
        <Panel
  	 header={this.title}
          bsStyle="info"
        >
          <FormField
            fieldname='phrasePrefix'
            label='Phrases with words starting'
            type='text'
            controller = {this.controller}
            focus={true}
            value = {this.prefix}
            formModule = 'PhraseSearch'
          />

          <Select
            name="Phrases"
            value = ''
            options={this.options}
            onChange={this.selectPhrase}
            open = {true}
            onClose = {this.reopenSelect}
          />

        </Panel>
      </div>
    );
  }
});

module.exports = PhraseSearch;
