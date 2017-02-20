import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/* eslint-disable object-shorthand */

export const EventData = new Mongo.Collection('EventData');

/**
 * Create the schema for EventtData
 */
export const EventDataSchema = new SimpleSchema({
  title: {
    label: 'Title of the event',
    type: String,
    optional: false,
  },
  start: {
    label: 'Start time of the event',
    type: String,
    optional: false,
  },
  end: {
    label: 'End time of the event',
    type: String,
    optional: false,
  },
  formattedStart: {
    label: 'Formatted start time of the event',
    type: String,
    optional: false,
  },
  formattedEnd: {
    label: 'Formatted end time of the event',
    type: String,
    optional: false,
  },
});

EventData.attachSchema(EventDataSchema);
