import { Tracker } from 'meteor/tracker';
import { EventData, EventDataSchema } from '../../api/eventdata/eventdata';

let isPast = (date) => {
  // Get access to today's moment
  let today = moment().format();
  return moment(today).isAfter(date);
};

Template.Calendar_Page.onCreated(() => {
  Template.instance().subscribe('EventData');
});

Template.Calendar_Page.onRendered(() => {
  // Initialize the calendar.
  $('#event-calendar').fullCalendar({
    header: {
      left:   'title',
      center: '',
      right:  'today prev,next'
    },
    // Add events to the calendar.
    events(start, end, timezone, callback) {
      let data = EventData.find().fetch().map((session) => {
        // Don't allow already past study events to be editable.
        session.editable = !isPast(session.start);
        return session;
      });

      if (data) {
        callback(data);
      }
    },
    eventRender(session, element) {
      element.find('.fc-content').html(
          `<h4 class="title">${session.title}</h4>
          <p class="time">${session.startString}</p>
          `
      );
    },
    // Modal to add event when clicking on a day.
    dayClick(date, session) {
      Session.set('eventModal', { type: 'add', date: date.format() });
      // Check if the date that was clicked on has already passed.
      if(moment(date.isSameOrAfter(moment(), 'day')) {
        $('#calendar').modal({ blurring: true }).modal('show');
      }
    },
  });

  // Updates the calendar if there are changes.
  Tracker.autorun(() => {
    EventData.find().fetch();
    $('#event-calendar').fullCalendar('refetchEvents');
  });
});
