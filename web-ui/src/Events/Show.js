import { Row, Col, Form, Button, Nav, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { create_event } from '../api';
import { connect } from 'react-redux';
import { find_by_id, isOwner } from './Helper';

// function InviteListShow({invites, isOwner}) {
//   //let counted = countInvites(invites);
//
// }

function CommentShow({comment, session, isOwner}) {
  let controls = (<></>);
  if (isOwner && comment.user.id === session.user_id) {
    controls = (<p>[Delete] [Edit]</p>);
  } else if (isOwner) {
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

function CommentListShow({comments, session, isOwner}){
  let rendered = comments.map((com) => <CommentShow comment={com} session={session} isOwner={isOwner}/>);
  return (
    <>
    <h4>Comments</h4>
    {rendered}
    </>);
}

function EventShow({eve, session, isOwner}) {
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
            isOwner={isOwner}/>
      </Col>
    </Row>
  );
}

function EventPage({events, session}) {
  let {id} = useParams();
  let eve = find_by_id(events, id);
  let isOwner = isOwner(session.user_id, eve);
  console.log([id, eve, isOwner]);
  if (eve && session) {
    return (<EventShow eve={eve} session={session} isOwner={isOwner}/>);
  } else {
    return (<h3>Please log in before viewing events.</h3>);
  }
}

export default connect(({events, session}) => ({events, session}))(EventPage);
