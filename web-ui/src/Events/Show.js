import { Row, Col, Form, Button, Nav, NavLink, Card, Alert, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetch_event, delete_event, fetch_events, create_comment, delete_comment, create_invite } from '../api';
import { connect } from 'react-redux';
import { isOwner, countInvites } from './Helper';

function InviteListShow({invites, owner_rights, session, eve}) {
    let counted = countInvites(invites);
    let rendered = invites.map((inv) => <InviteShow key={inv.id} invite={inv} owner_rights={owner_rights}/>);
    let new_invite = owner_rights ? (<NewInvite eve={eve} session={session}/>) : (<></>)
    return (
      <>
      {new_invite}
      <h4>Invites</h4>
      <p>{counted}</p>
      {rendered}
      </>);
}

function NewInvite({eve, session}) {
  let [inv, setInvite] = useState({});

  function onSubmit(ev) {
    ev.preventDefault();
    if (session) {
      inv["event_id"] = eve.id;
      let response = create_invite(inv);
      fetch_event(eve.id);
    }
  }

  function updateEmail(ev) {
    let i1 = Object.assign({}, inv);
    i1["user_email"] = ev.target.value;
    setInvite(i1);
  }

  return (
    <Row>
      <Col>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Control type="email"
                          placeholder="Type a new invitee's email..."
                          onChange={email => { updateEmail(email); }}
                          value={inv.user_email} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Invite
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

function InviteShow({invite, owner_rights}) {
  return (<><p>{invite.user.name} - {invite.response}</p></>)
}



function CommentsNew({eve, session}) {
  let [com, setComment] = useState({});

  function onSubmit(ev) {
    ev.preventDefault();
    if (session) {
      com["user_id"] = session.user_id;
      com["event_id"] = eve.id;
      let response = create_comment(com);
      fetch_event(eve.id);
    }
  }

  function updateBody(ev) {
    let c1 = Object.assign({}, com);
    c1["body"] = ev.target.value;
    setComment(c1);
  }

  return (
    <Row>
      <Col>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Control as="textarea"
                          rows={2}
                          placeholder="Type your comment here..."
                          onChange={body => { updateBody(body); }}
                          value={com.body} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Post Comment
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

function CommentControls({comment,  session, owner_rights}) {
  let editLink = "/comments/" + comment.id + "/edit";
  let deleteLink = "/events/" + comment.event_id;

  function deleteComment() {
    // delete the comment, update this event
    delete_comment(comment);
    fetch_event(comment.event_id);
    fetch_events();
  }

  if (owner_rights && comment.user.id === session.user_id) {
    return (
    <div>
      <Link to={editLink}>Edit</Link>
       /
      <Link to={deleteLink} onClick={() => deleteComment()}>Delete</Link>
    </div>
    );
  } else if (owner_rights) {
    return (
    <div>
      <Link to={deleteLink} onClick={() => deleteComment()}>Delete</Link>
    </div>
    );
  }
}

function CommentShow({comment, session, owner_rights}) {

  return (
    <Card>
      <Card.Body>
        <p>Posted by {comment.user.name}</p>
        <Card.Text>{comment.body}</Card.Text>
        <CommentControls comment={comment} session={session} owner_rights={owner_rights}/>
      </Card.Body>
    </Card>);
}

function CommentListShow({comments, eve, session, owner_rights}){
  let rendered = comments.map((com) => <CommentShow
                                          key={com.id}
                                          comment={com}
                                          session={session}
                                          owner_rights={owner_rights}/>);
  return (
    <>
    <CommentsNew eve={eve} session={session}/>
    <h4>Comments</h4>
    {rendered}
    </>);
}


function EventControls({eve}) {
  let editLink = "/events/" + eve.id + "/edit";
  let deleteLink = "/";

  function deleteEvent() {
    // delete the event, then update the list that the app works from.
    delete_event(eve);
    fetch_events();
  }

  return (
  <div>
    <Link to={editLink}>Edit</Link>
     /
    <Link to={deleteLink} onClick={() => deleteEvent()}>Delete</Link>
  </div>
  );
}

function EventShow({eve, session}) {
  let owner_rights = isOwner(session.user_id, eve);
  let controls = owner_rights ? (<EventControls eve={eve}/>) : (<></>);
  return (
    <>
    <Row>
      <Col>
        {controls}
      </Col>
    </Row>
    <Row>
      <Col sm={8}>
        <h1>{eve.name}</h1>
        <h6>{eve.date}</h6>
        <h6>{eve.user.name}</h6>
        <p>{eve.desc}</p>
        <CommentListShow
            comments={eve.comments}
            session={session}
            eve={eve}
            owner_rights={owner_rights}/>
      </Col>
      <Col sm={4}>
        <InviteListShow
            invites={eve.invites}
            owner_rights={owner_rights}
            session={session}
            eve={eve}/>
      </Col>
    </Row>
    </>
  );
}

function LoggedInCheck({current_event, session}) {
  if (current_event && session) {
    return (<EventShow eve={current_event} session={session}/>);
  } else {
    return (<><h3>Event not available.</h3>
      <p>Please make sure you are logged in and have access.</p></>);
  }
}

function EOL({session, current_event}) {
  let {id} = useParams();
  if (!(current_event && current_event.id == id)) {
    fetch_event(id);
    return (<h4>Loading event...</h4>);
  } else {
    return (<LoggedInCheck current_event={current_event} session={session}/>);
  }
}

const EventOrLoading = connect(({session, current_event}) => ({session, current_event}))(EOL);

function EventPage({error}) {
  let error_row = null;

  if (error) {
    error_row = (
      <Row>
        <Col>
          <Alert variant="danger">{error}</Alert>
        </Col>
      </Row>
    );
  }
  return (
    <div>
      { error_row }
      <EventOrLoading/>
    </div>
  );
}

export default connect(({error}) => ({error}))(EventPage);
