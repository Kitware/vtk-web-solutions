export default (session) => ({
    lifeCycleUpdate(phaseName) {
      return session.call("trame.lifecycle.update", [phaseName]);
    },
    sendError(message) {
      return session.call("trame.error.client", [message]);
    },
    getState() {
      return session.call("trame.state.get", []);
    },
    trigger(name, args = [], kwargs = {}) {
      return session.call("trame.trigger", [name, args, kwargs]);
    },
    updateState(changes) {
      return session.call("trame.state.update", [changes]);
    },
    subscribeToStateUpdate(callback) {
      return session.subscribe("trame.state.topic", callback);
    },
    subscribeToActions(callback) {
      return session.subscribe("trame.actions.topic", callback);
    },
    unsubscribe(subscription) {
      return session.unsubscribe(subscription);
    },
  });