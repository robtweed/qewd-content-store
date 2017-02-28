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
var FormField = require('./FormField');

var {
  Button,
  ButtonGroup,
  ButtonToolbar,
  ControlLabel,
  DropdownButton,
  Form,
  FormGroup,
  Glyphicon,
  MenuItem,
  Panel,
  SplitButton,
  Tooltip,
  OverlayTrigger
} = ReactBootstrap;

var PhraseViewer = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial',
      tagValue: ''
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-PhraseViewer')(this.props.controller, this);

    this.titleWithoutSearch = (
        <b>Edit/Maintain Phrase</b>
    );

    this.tooltip = (
      <Tooltip 
        id = "searchBtn"
      >
        Search for a Phrase
      </Tooltip>
    );

    this.titleWithSearch = (
      <span>
          <b>Edit/Maintain Phrase</b>
          <OverlayTrigger 
            placement="top" 
            overlay={this.tooltip}
          >
            <Button 
              bsClass="btn btn-success pull-right"
              onClick = {this.openSearch}
            >
              <Glyphicon 
                glyph="search"
              />
            </Button>
        </OverlayTrigger>
      </span>
    );
  },

  componentWillReceiveProps: function(newProps) {
    console.log('PhraseViewer receiving new props: ' + JSON.stringify(newProps));
    this.selectedPhrase = newProps.selectedPhrase;

    this.phraseObject = newProps.data.phraseObject;
    this.phraseId = newProps.data.phraseId;
    this.storeSelected = newProps.data.storeSelected;
    this.show = newProps.data.show;
  },


  render: function() {

    console.log('Rendering PhraseViewer');
    //var componentPath = this.controller.updateComponentPath(this);

    console.log('phaseObject: ' + JSON.stringify(this.phraseObject, null, 2));

    this.oSubject = '* undefined *';
    this.oValue = '* undefined *';
    this.oUnit = '* undefined *';

    if (this.phraseObject.subject && this.phraseObject.subject.value) this.oSubject = this.phraseObject.subject.value;
    if (this.phraseObject.value) {
      if (this.phraseObject.value.value) {
        this.oValue = this.phraseObject.value.value;
      }
      else {
        if (this.phraseObject.value === '?') {
          this.oValue = '* user-defined *';
        }
      }
    }
    if (this.phraseObject.unit && this.phraseObject.unit.value) this.oUnit = this.phraseObject.unit.value;

    if (this.storeSelected) {
      this.title = this.titleWithSearch;
    }
    else {
      this.title = this.titleWithoutSearch;
    }

    var display = '';
    if (!this.show) display = 'hidden';

    if (this.phraseId === '') {
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

    var tagButtons = [];
    var button;
    var count = 0;

    for (var tag in this.phraseObject.tags) {

      button = (
        <DropdownButton
          bsStyle='info'
          className = 'btnAlign'
          title={tag}
          key={'tagBtn-' + count}
          id={tag + '-tagBtn'}
        >
          <MenuItem
            eventKey={tag + '-select'}
            onSelect={this.switchToTag}
          >
            Select
          </MenuItem>
          <MenuItem
            eventKey={tag + '-delete'}
            onSelect={this.deleteTagFromPhrase}
          >
            Delete
          </MenuItem>
        </DropdownButton>
      );

      tagButtons.push(button);
      count++;
    }



    return (

      <div
        className = {display}
      >

        <Panel
  	 header={this.title}
          bsStyle="info"
        >
          <FormField
            placeholder='Authored Phrase'
            fieldname='authoredPhrase'
            label='Authored Phrase'
            type='text+button'
            value = {this.phraseObject.authoredPhrase}
            controller = {this.controller}
            focus={true}
            formModule = 'PhraseViewer'
            btnHandler = {this.editPhrase}
            btnStyle = 'success'
            btnText = 'Update'
          />

          <FormField
            label='Displayed Phrase'
            type='static-inline'
            value = {this.phraseObject.uiPhrase}
          />

          <FormField
            label='Subject'
            type='static-inline'
            value = {this.oSubject}
          />

          <FormField
            label='Value'
            type='static-inline'
            value = {this.oValue}
          />

          <FormField
            label='Unit'
            type='static-inline'
            value = {this.oUnit}
          />

          <FormGroup>
            <ControlLabel>Tags</ControlLabel>
          </FormGroup>

          <FormGroup>
              {tagButtons}
          </FormGroup>

          <Form inline>
            <FormField
              placeholder='Additional tag(s)'
              fieldname='newTags'
              label='Additional Tags: &nbsp;'
              type='text'
              controller = {this.controller}
              formModule = 'PhraseViewer'
            />

            <Button
             onClick={this.addTagToPhrase}
             bsStyle='success'
             key = {count}
            >
              <Glyphicon 
                glyph="plus"
              />
            </Button>
          </Form>

          <Button
           onClick={this.deletePhrase}
           bsStyle='danger'
          >
            Delete Phrase
          </Button>


        </Panel>
      </div>
    );
  }
});

module.exports = PhraseViewer;
