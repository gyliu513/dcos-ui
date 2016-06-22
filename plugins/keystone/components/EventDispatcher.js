var EventDispatcher = require('flux').Dispatcher;

var EventDispatcher = Object.assign(new Dispatcher(), {

  handleServerAction: function (action) {
    if (!action.type) {
      console.warn('Empty action.type: you likely mistyped the action.');
    }

    this.dispatch({
      source: "EventAction",
      action: action
    });
  }

});

module.exports = EventDispatcher;