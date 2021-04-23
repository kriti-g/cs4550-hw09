import store from './store';

export const url = "https://events-spa.gkriti.art/api/v1";
//export const url = "http://localhost:4000/api/v1";

function session_token() {
  let state = store.getState();
  return state?.session?.token;
}

export async function api_get(path) {
  let stoken = session_token();
  let opts = {
    method: "GET",
    headers: {
      "Session-Token": stoken,
    },
  };
  let text = await fetch(url + path, opts);
  let resp = await text.json();
  return resp.data;
}

async function api_post(path, data) {
  let stoken = session_token();
  let opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Session-Token": stoken,
    },
    body: JSON.stringify(data),
  };
  let text = await fetch(url + path, opts);
  return await text.json();
}

async function api_patch(path, data) {
  let stoken = session_token();
  let opts = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Session-Token": stoken,
    },
    body: JSON.stringify(data),
  };

  let text = await fetch(url + path, opts);
  return await text.json();
}

async function api_delete(path, data) {
  let stoken = session_token();
  let opts = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Session-Token": stoken,
    },
    body: JSON.stringify(data),
  };

  let text = await fetch(url + path, opts);
  return text;
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

export async function create_user(user) {
  return await api_post("/users", {user});
}

export async function update_user(user) {
  return api_patch("/users/" + user.id, { user });
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

export async function create_event(event) {
  return await api_post("/events", { event });
}

export async function update_event(event) {
  return api_patch("/events/" + event.id, { event });
}

export function delete_event(eve_id) {
  return api_delete("/events/" + eve_id, { id: eve_id });
}

export async function create_comment(comment) {
  return await api_post("/comments", { comment });
}

export async function delete_comment(com_id) {
  return api_delete("/comments/" + com_id, { id: com_id });
}

export async function create_invite(invite) {
  return await api_post("/invites", { invite });
}

export async function update_invite(invite) {
  return api_patch("/invites/" + invite.id, { invite });
}

// export async function update_user(user) {
//   return api_patch("/users/" + user.id, { user });
// }

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
