import { Row, Col, Form, Button, Nav, NavLink, Card, Alert, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetch_event, delete_event, fetch_events, create_comment } from '../api';
import { connect } from 'react-redux';
import { isOwner } from './Helper';

// function InviteListShow({invites, owner_rights}) {
//   //let counted = countInvites(invites);
//
// }

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
            <Form.Label>Desc</Form.Label>
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

function CommentShow({comment, session, owner_rights}) {
  let controls = (<></>);
  if (owner_rights && comment.user.id === session.user_id) {
    controls = (<p>[Delete] [Edit]</p>);
  } else if (owner_rights) {
    controls = (<p>[Delete]</p>);
  }
  return (
    <Card>
      <Card.Body>
        <p>Posted by {comment.user.name}</p>
        <Card.Text>{comment.body}</Card.Text>
        {controls}
      </Card.Body>
    </Card>);
}

function CommentListShow({comments, eve, session, owner_rights}){
  let rendered = comments.map((com) => <CommentShow comment={com} session={session} owner_rights={owner_rights}/>);
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
      <Col>
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
