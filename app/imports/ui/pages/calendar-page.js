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
    // // Drag and drop events.
    // eventDrop(session, delta, revert) {
    //   let date = session.start.format();
    //   if (!isPast(date)) {
    //     let update = {
    //       _id: session._id,
    //       start: date,
    //       end: date
    //     };
    //
    //     Meteor.call('editEvent', update, (error) => {
    //       if (error) {
    //         Bert.alert(error.reason, 'danger');
    //       }
    //     });
    //   } else {
    //     revert();
    //     Bert.alert('Sorry, you can\'t move items to the past!', 'danger');
    //   }
    // },
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

    // Directs to study session detail page.
    // eventClick(event) {
    //   Session.set('eventModal', { type: 'edit', event: event._id });
    //   FlowRouter.go('Study_Session_Detail_Page', { _id: event._id });
    // },
  });

  // Updates the calendar if there are changes.
  Tracker.autorun(() => {
    EventData.find().fetch();
    $('#event-calendar').fullCalendar('refetchEvents');
  });
});
