import store from './store';

//export const base_url = "http://events-spa-api.gkriti.art/api/v1";
export const base_url = "http://localhost:4000/api/v1";

export async function api_get(path) {
    let text = await fetch(base_url + path, {});
    let resp = await text.json();
    return resp.data;
}

async function api_post(path, data) {
  let opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  };
  let text = await fetch(
    base_url + path, opts);
  return await text.json();
}

export function fetch_users() {
    api_get("/users").then((data) => store.dispatch({
        type: 'users/set',
        data: data,
    }));
}

export function fetch_user(id) {
    api_get("/users/"+id).then((data) => store.dispatch({
        type: 'user_form/set',
        data: data,
    }));
}

export function create_user(user) {
  return api_post("/users", {user});
}

export function fetch_events() {
    api_get("/events").then((data) => store.dispatch({
        type: 'events/set',
        data: data,
    }));
}

export function fetch_event(id) {
    api_get("/events/"+id).then((data) => store.dispatch({
        type: 'events/single',
        data: data,
    }));
}

export function create_event(eve, session) {
  let data = new FormData();
  data.append("event[name]", eve.name);
  data.append("event[desc]", eve.desc);
  data.append("event[date]", eve.date);
  data.append("event[user_id]", eve.user_id);
  data.append("session[user_id]", session.user_id);
  data.append("session[token]", session.token);
  fetch(base_url + "/events", {
    method: 'POST',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    console.log(resp);
  });
}

export function create_comment(com) {
  let data = new FormData();
  data.append("comment[body]", com.body);
  data.append("comment[event_id]", com.event_id);
  data.append("comment[user_id]", com.user_id);
  fetch(base_url + "/comments", {
    method: 'POST',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    return resp.json().then(null, () => {
      let action = {
        type: 'error/set',
        data: 'Unable to post comment',
      };
      store.dispatch(action);
    });
  }).then((data) => {
    fetch_event(com.event_id);
    fetch_events();
  });
}

export function delete_comment(com) {
  let data = new FormData();
  data.append("id", com.id);
  fetch(base_url + "/comments/"+com.id, {
    method: 'DELETE',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    fetch_event(com.event_id);
    fetch_events();
  });
}

export function create_invite(inv) {
  let data = new FormData();
  data.append("invite[user_email]", inv.user_email);
  data.append("invite[event_id]", inv.event_id);
  data.append("invite[response]", inv.response);
  fetch(base_url + "/invites", {
    method: 'POST',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    return resp.json();
  }).then((data) => {
    data = data.data;
    if ( data.user && data.user.name && data.user.name === "---CHANGE THIS TO YOUR NAME---") {
      let url = 'http://events-spa.gkriti.art/edituser/' + data.user.id;
      let action = {
        type: 'message/set',
        data: url,
      };
      store.dispatch(action);
    } else if (data.event_id) {
      let url = 'http://events-spa.gkriti.art/events/' + data.event_id;
      let action = {
        type: 'message/set',
        data: url,
      };
      store.dispatch(action);
    }
  });
}

export function update_invite(inv) {
  let data = new FormData();
  data.append("id", inv.id);
  data.append("invite[response]", inv.response);
  fetch(base_url + "/invites/"+inv.id, {
    method: 'PATCH',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    console.log(resp);
  });
}

export function update_user(user) {
  let data = new FormData();
  data.append("id", user.id);
  data.append("user[name]", user.name);
  data.append("user[email]", user.email);
  data.append("user[password]", user.password);
  fetch(base_url + "/users/"+user.id, {
    method: 'PATCH',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    fetch_users();
  });
}

export function update_event(eve, session) {
  let data = new FormData();
  data.append("event[name]", eve.name);
  data.append("event[desc]", eve.desc);
  data.append("event[date]", eve.date);
  data.append("id", eve.id);
  data.append("session[user_id]", session.user_id);
  data.append("session[token]", session.token);
  fetch(base_url + "/events/" + eve.id, {
    method: 'PATCH',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    console.log(resp);
  });
}

export function delete_event(eve) {
  let data = new FormData();
  data.append("id", eve.id);
  fetch(base_url + "/events/"+eve.id, {
    method: 'DELETE',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    if(!resp.ok){
      let action = {
        type: 'error/set',
        data: 'Unable to delete event.',
      };
      store.dispatch(action);
    }else {
      fetch_events();
    }
  });
}

export function api_login(email, password) {
  api_post("/session", {email, password}).then((data) => {
    console.log("login resp", data);
    if (data.session) {
      let action = {
        type: 'session/set',
        data: data.session,
      }
      store.dispatch(action);
    }
    else if (data.error) {
      let action = {
        type: 'error/set',
        data: data.error,
      };
      store.dispatch(action);
    }
  });
}

export function load_defaults() {
    fetch_users();
    fetch_events();
}
