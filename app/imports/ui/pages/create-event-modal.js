import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { EventData, EventDataSchema } from '../../api/eventdata/eventdata.js';

/* eslint-disable no-param-reassign */

const displayErrorMessages = 'displayErrorMessages';

Template.Create_Study_Session_Page.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.context = SessionsSchema.namedContext('Create_Event_Modal');
});

Template.Create_Study_Session_Page.helpers({
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return _.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
});

Template.Create_Study_Session_Page.onRendered(function enableSemantic() {
  const instance = this;
  instance.$('.ui.radio.checkbox').checkbox();
  instance.$('.ui.fluid.search.dropdown').dropdown();
});

Template.Create_Study_Session_Page.events({
  'submit .session-data-form'(event, instance) {
    event.preventDefault();
    // console.log(Session.get('eventModal'));
    let newSession = Session.get('eventModal');
    const title = event.target.title.value;
    const name = Meteor.user().profile.name;
    let guestsPros = [];
    let guestsStuds = [];
    const e = document.getElementById(event.target.course.id);
    let course = e.options[e.selectedIndex].value;
    if (course === 'Select a Course') {
      course = '';
    }
    const topic = [event.target.topic.value];
    const f = document.getElementById(event.target.start.id);
    // Get the date and add the time to the end.
    let start = newSession.date+"T"+f.options[f.selectedIndex].value+"-10:00";
    if (start === 'Select a Start Time') {
      start = '';
    }
    const g = document.getElementById(event.target.end.id);
    let end = newSession.date+"T"+g.options[g.selectedIndex].value+"-10:00";
    if (end === 'Select an End Time') {
      end = '';
    }
    const startV = parseInt(event.target.start.value);
    const endV = parseInt(event.target.end.value);

    // Store the start and end time in a string format.
    const startString = f.options[f.selectedIndex].text;
    const endString = g.options[g.selectedIndex].text;

    //console.log(startString);
    //console.log(endString);

    if (document.getElementById('groupJoin') === null) {
      const indivJoin = event.target.indivJoin.value;
      if (indivJoin === 'joinPro') {
        guestsPros.push(name);
      } else {
        guestsStuds.push(name);
      }
    } else {
      const groupJoin = document.getElementById('groupJoin');
      const pros = [];
      const studs = [];
      for (let i = 0; i < groupJoin.options.length; i++) {
        if (groupJoin.options[i].selected) {
          pros.push(groupJoin.options[i].value);
        }
        else
          if (groupJoin.options[i].value != '') {
            studs.push(groupJoin.options[i].value);
          }
      }
      guestsPros = pros;
      guestsStuds = studs;
    }


    // const newSession = { name, course, topic, start, end, startV, endV };
    newSession = { title, name, course, topic, start, end, startV, endV, startString, endString, guestsPros, guestsStuds };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newSession reflects what will be inserted.
    SessionsSchema.clean(newSession);
    // Determine validity.
    instance.context.validate(newSession);
    if (instance.context.isValid()) {
      Sessions.insert(newSession);
      instance.messageFlags.set(displayErrorMessages, false);
      $('#calendar')
          .modal('hide')
      ;
      FlowRouter.go('Calendar_Page');
    } else {
      // console.log("invalid");
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },

  'click .cancel'(event, instance){
    event.preventDefault();
    $('#calendar')
        .modal('hide')
    ;
  },
});