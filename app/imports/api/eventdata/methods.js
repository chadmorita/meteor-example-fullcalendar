import { EventData, EventDataSchema } from '../../api/eventdata/eventdata';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.methods({
  // Allows an event to be edited.
  editEvent( event ) {
    try {
      return EventData.update( event._id, {
        $set: event
      });
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
});
