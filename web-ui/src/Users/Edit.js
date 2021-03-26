
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import pick from 'lodash/pick';

import { update_user, fetch_users, fetch_user } from '../api';

function UserEdit({current_user}) {
let history = useHistory();
const [user, setUser] = useState({
  name: current_user.name, email: current_user.email, pass1: "", pass2: "",
});

function onSubmit(ev) {
  ev.preventDefault();

  let data = pick(user, ['name', 'email', 'password']);
  data["id"] = current_user.id;
  console.log(["user", data])
  update_user(data).then(() => {
    fetch_users();
    history.push("/users");
  });
}

function check_pass(p1, p2) {
  // This is for user experience only,
  // validation logic goes on the server.
  if (p1 !== p2) {
    return "Passwords don't match.";
  }

  if (p1.length < 8) {
    return "Password too short.";
  }

  return "";
}

function update(field, ev) {
  let u1 = Object.assign({}, user);
  u1[field] = ev.target.value;
  u1.password = u1.pass1;
  u1.pass_msg = check_pass(u1.pass1, u1.pass2);
  setUser(u1);
}

return (
  <Form onSubmit={onSubmit}>
    <Form.Group>
      <Form.Label>Name</Form.Label>
      <Form.Control type="text"
                    onChange={
                      (ev) => update("name", ev)}
        value={user.name} />
    </Form.Group>
    <Form.Group>
      <Form.Label>Email</Form.Label>
      <Form.Control type="text"
                    onChange={
                      (ev) => update("email", ev)}
        value={user.email} />
    </Form.Group>
    <Form.Group>
      <Form.Label>Password</Form.Label>
      <Form.Text>
          Even if you don't wish to change your password,
          you must type it in to verify your identity.
      </Form.Text>
      <Form.Control type="password"
        onChange={
          (ev) => update("pass1", ev)}
        value={user.pass1} />
      <p>{user.pass_msg}</p>
    </Form.Group>
    <Form.Group>
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control type="password"
        onChange={
          (ev) => update("pass2", ev)}
        value={user.pass2} />
    </Form.Group>
    <Button variant="primary" type="submit"
            disabled={user.pass_msg !== ""}>
      Save
    </Button>
  </Form>
);
}


function LoggedInCheck({current_user, session}) {
  if ((current_user && session && session.user_id==current_user.id)
      || (current_user && current_user.name === "---CHANGE THIS TO YOUR NAME---")) {
    return (<UserEdit current_user={current_user} session={session}/>);
  } else {
    return (<><h3>User not available.</h3>
      <p>Please make sure you are logged in or have other access.</p></>);
  }
}

function UOL({session, user_form}) {
  let {id} = useParams();
  if (!(user_form && user_form.id == id)) {
    fetch_user(id);
    return (<h4>Loading user...</h4>);
  } else {
    return (<LoggedInCheck current_user={user_form} session={session}/>);
  }
}

const UserOrLoading = connect(({session, user_form}) => ({session, user_form}))(UOL);

function EditUserPage() {
  return (
    <div>
      <UserOrLoading/>
    </div>
  );
}

function state2props(_state) {
return {};
}

export default connect(state2props)(EditUserPage);
