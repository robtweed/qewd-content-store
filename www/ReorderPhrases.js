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
var Reorder = require('react-reorder');

var {
  Button,
  Panel
} = ReactBootstrap;

var ReorderPhrases = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial',
      tagValue: ''
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-ReorderPhrases')(this.props.controller, this);
    this.title = (
      <span>
          <b>Re-order Phrases</b>
          <Button 
            bsClass="btn btn-primary pull-right"
            onClick = {this.cancel}
          >
            Cancel/Done
          </Button>
      </span>
    );
  },

  componentWillReceiveProps: function(newProps) {
    console.log('ReorderPhrases receiving new props: ' + JSON.stringify(newProps));
    this.show = newProps.data.show;
    this.tagName = newProps.data.tagName;
    this.options = newProps.data.options;

  },


  render: function() {

    console.log('Rendering ReorderPhrases');
    //var componentPath = this.controller.updateComponentPath(this);

    this.phraseOrder = [];
    this.phrases = [];
    var self = this;
    this.options.forEach(function(option) {
      self.phraseOrder.push(option.value);
      self.phrases.push(option.label);
    });

    console.log('Phrases: ' + JSON.stringify(this.phrases));

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

          <Reorder
            lock='horizontal'
            holdTime='100'
            list = {this.phrases}
            callback={this.onReorder}
            listClass='reorder-list'
            itemClass='reorder-item'
          />

        </Panel>
      </div>
    );
  }
});

module.exports = ReorderPhrases;
