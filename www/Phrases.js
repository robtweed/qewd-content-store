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

var PhraseTableRow = require('./PhraseTableRow');

var {
  Button,
  Glyphicon,
  OverlayTrigger,
  Panel,
  Table,
  Tooltip
} = ReactBootstrap;

var Phrases = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial',
      tagValue: ''
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-Phrases')(this.props.controller, this);

    this.title = (
      <h2>Phrases</h2>
    );



  },

  componentWillReceiveProps: function(newProps) {
    console.log('Phrases receiving new props: ' + JSON.stringify(newProps));

    this.options = newProps.data.options;
    this.tagName = newProps.data.selectedTagName;
    this.show = newProps.data.show;

    if (this.tagName && this.tagName !== '') {

      this.tooltip = (
        <Tooltip 
          id = "addPhraseBtn"
        >
          Add a new phrase
        </Tooltip>
      );

      this.reorderTooltip = (
        <Tooltip 
          id = "reorderBtn"
        >
          Re-order Phrases
        </Tooltip>
      );

      this.title = (
        <span>
          <b>Phrases tagged {this.tagName}</b>

          <OverlayTrigger 
            placement="top" 
            overlay={this.reorderTooltip}
          >
            <Button 
              bsClass="btn btn-success pull-right"
              onClick = {this.reorder}
            >
              <Glyphicon 
                glyph="sort"
              />
            </Button>
          </OverlayTrigger>


          <OverlayTrigger 
            placement="top" 
            overlay={this.tooltip}
          >
            <Button 
              bsClass="btn btn-success pull-right"
              onClick = {this.addPhrase}
            >
              <Glyphicon 
                glyph="plus"
              />
            </Button>
          </OverlayTrigger>
        </span>
      );
    }
    else {
      this.title = (
        <h2>Phrases</h2>
      );
    }

  },

  logChange: function(option) {
    console.log('selected ' + JSON.stringify(option));
    
    this.selectTag(option);
  }, 

  render: function() {

    console.log('Rendering Phrases');
    //var componentPath = this.controller.updateComponentPath(this);

    var display = '';
    if (!this.show) display = 'hidden';

    var rows = [];
    var row;

    var self = this;
    this.options.forEach(function(option) {
      row = (
        <PhraseTableRow
          key = {option.value}
          phrase = {option.label}
          id = {option.value}
          controller={self.controller}
        />
      );
      rows.push(row);
    });

    if (this.options.length === 0) {
      return (
        <div
          className = {display}
        >
          <Panel
    	     header={this.title}
            bsStyle="info"
          />
        </div>
      );
    }
    

    return (
      <div
        className = {display}
      >
        <Panel
          header={this.title}
          bsStyle="info"
        >
          <Table 
            responsive  
            className = "phraseTable"
          >
            <thead>
              <tr>
                <th>Phrase</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </Panel>
      </div>
    );
  }
});

module.exports = Phrases;
