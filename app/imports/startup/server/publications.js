import { EventData } from '../../api/eventdata/eventdata.js';
import { Meteor } from 'meteor/meteor';

Meteor.publish('EventData', function publishStudentData() {
  return EventData.find();
});
