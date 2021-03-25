import { Row, Col, Form, Button, Nav, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetch_event } from '../api';
import { connect } from 'react-redux';
import { find_by_id, isOwner } from './Helper';

// function InviteListShow({invites, owner_rights}) {
//   //let counted = countInvites(invites);
//
// }

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

// function Controls(){
//   return (<></>);
// }



function CommentListShow({comments, session, owner_rights}){
  let rendered = comments.map((com) => <CommentShow comment={com} session={session} owner_rights={owner_rights}/>);
  return (
    <>
    <h4>Comments</h4>
    {rendered}
    </>);
}

function EventShow({eve, session}) {
  let owner_rights = isOwner(session.user_id, eve);
  return (
    <Row>
      <Col>
        <h1>{eve.name}</h1>
        <h6>{eve.date}</h6>
        <h6>{eve.user.name}</h6>
        <p>{eve.desc}</p>
        <CommentListShow
            comments={eve.comments}
            session={session}
            owner_rights={owner_rights}/>
      </Col>
    </Row>
  );
}

function EventPage({current_event, session}) {
  let {id} = useParams();
  let eve = null;
  if (!(current_event && current_event.id == id)) {
    fetch_event(id);
  }
  console.log([id, current_event]);
  if (current_event && session) {
    return (<EventShow eve={current_event} session={session}/>);
  } else {
    return (<h3>Please log in before viewing events.</h3>);
  }
}


export default connect(({current_event, session}) => ({current_event, session}))(EventPage);
