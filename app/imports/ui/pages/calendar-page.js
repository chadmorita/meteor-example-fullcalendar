import { Tracker } from 'meteor/tracker';
import { EventData, EventDataSchema } from '../../api/eventdata/eventdata';

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
        // Don't allow already past study sessions to be editable.
        session.editable = !isPast(session.start);
        return session;
      });

      if (data) {
        callback(data);
      }
    },
    eventRender(session, element) {
      element.find('.fc-content').html(
          `<h4 class="course">${session.course}</h4>
          <p class="topic">${session.topic}</p>
          `
      );
    },
    // Modal to add event when clicking on a day.
    dayClick(date, session) {
      Session.set('eventModal', { type: 'add', date: date.format() });
      console.log("Clicked on the day.");
      // Check if the date has already passed.
      if(!moment(date.format()).isBefore(moment())) {
        console.log("Show the modal");
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
