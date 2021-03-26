import store from './store';

export async function api_get(path) {
    let text = await fetch("http://localhost:4000/api/v1" + path, {});
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
    "http://localhost:4000/api/v1" + path, opts);
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

export function create_event(eve) {
  let data = new FormData();
  data.append("event[name]", eve.name);
  data.append("event[desc]", eve.desc);
  data.append("event[date]", eve.date);
  data.append("event[user_id]", eve.user_id);
  fetch("http://localhost:4000/api/v1/events", {
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
  fetch("http://localhost:4000/api/v1/comments", {
    method: 'POST',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    console.log(resp);
  });
}

export function delete_comment(com) {
  let data = new FormData();
  data.append("id", com.id);
  fetch("http://localhost:4000/api/v1/comments/"+com.id, {
    method: 'DELETE',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    console.log(resp);
  });
}

export function create_invite(inv) {
  let data = new FormData();
  data.append("invite[user_email]", inv.user_email);
  data.append("invite[event_id]", inv.event_id);
  data.append("invite[response]", inv.response);
  fetch("http://localhost:4000/api/v1/invites", {
    method: 'POST',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    console.log(resp);
    console.log(resp.body);
  });
}

export function update_invite(inv) {
  let data = new FormData();
  data.append("id", inv.id);
  data.append("invite[response]", inv.response);
  fetch("http://localhost:4000/api/v1/invites/"+inv.id, {
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
  fetch("http://localhost:4000/api/v1/users/"+user.id, {
    method: 'PATCH',
    // Fetch will handle reading the file object and
    // submitting this as a multipart/form-data request.
    body: data,
  }).then((resp) => {
    console.log(resp);
  });
}

export function update_event(eve) {
  let data = new FormData();
  data.append("event[name]", eve.name);
  data.append("event[desc]", eve.desc);
  data.append("event[date]", eve.date);
  data.append("id", eve.id);
  fetch("http://localhost:4000/api/v1/events/" + eve.id, {
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
  fetch("http://localhost:4000/api/v1/events/"+eve.id, {
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
