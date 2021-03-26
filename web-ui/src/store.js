import { createStore, combineReducers } from 'redux';

function users(state = [], action) {
  switch (action.type) {
    case 'users/set':
      return action.data;
    default:
      return state;
  }
}

function user_form(state = {}, action) {
  switch (action.type) {
    case 'user_form/set':
      return action.data;
    default:
      return state;
  }
}

function save_session(sess) {
  let session = Object.assign({}, sess, {time: Date.now()});
  localStorage.setItem("session", JSON.stringify(session));
}

function load_session() {
  let session = localStorage.getItem("session");
  if (!session) {
    return null;
  }
  session = JSON.parse(session);
  let age = Date.now() - session.time;
  let hours = 60*60*1000;
  if (age < 24 * hours) {
    return session;
  }
  else {
    return null;
  }
}

function session(state = load_session(), action) {
  switch (action.type) {
  case 'session/set':
    save_session(action.data);
    return action.data;
  case 'session/clear':
    return null;
  default:
    return state;
  }
}

function error(state = null, action) {
  switch (action.type) {
  case 'error/set':
    return action.data;
  case 'session/set':
    return null;
  default:
    return state;
  }
}

function message(state = null, action) {
  switch (action.type) {
    case 'message/set':
      return action.data;
    default:
      return state;
  }
}

function events(state = [], action) {
  switch (action.type) {
    case 'events/set':
      return action.data;
    default:
      return state;
  }
}

function current_event(state = [], action) {
  switch (action.type) {
    case 'events/single':
      return action.data;
    default:
      return state;
  }
}

function root_reducer(state, action) {
  console.log("root reducer", state, action);

  let redu = combineReducers(
    {users, user_form, events, session, error, current_event, message}
  );

  let state1 = redu(state, action);
  console.log("state1", state1);

  return state1;
}

let store = createStore(root_reducer);
export default store;
