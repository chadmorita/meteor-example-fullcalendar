import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  name: 'Calendar_Page',
  action() {
    BlazeLayout.render('App_Layout', { main: 'Calendar_Page' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_Layout', { main: 'App_Not_Found' });
  },
};
