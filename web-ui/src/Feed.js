import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { inInvites, isOwner } from './Events/Helper';

function Event({eve, key}) {
  let main_page = "/events/" + eve.id;
  return (
    <Col>
    <Card>
    <Card.Body>
    <Card.Title>{ eve.name }</Card.Title>
    <Card.Subtitle>{eve.date}</Card.Subtitle>
    <Card.Text>
    { eve.user.name}'s Event <br />
    { eve.desc }
    <Link to={main_page}>View</Link>
    </Card.Text>
    </Card.Body>
    </Card>
    </Col>
  );
}

function LoggedIn({events, session}) {
  let cards = events.map((eve) => {
    if (inInvites(session.user_id, eve) || isOwner(session.user_id, eve)) {
      return (<Event eve={eve} key={eve.id} />);
    } else {
      return (<></>);
    }
  });
  return (
    <>
    <Row>
    <Col>
    <h2>{session.name}'s Events</h2>
    <p><Link to="/events/new">New Event</Link></p>
    </Col>
    </Row>
    <Row>
    { cards }
    </Row>
    </>
  );
}

function Feed({events, session}) {
  if (session) {
    return (<LoggedIn session={session} events={events}/>)
  } else {
    return (
      <>
      <Row>
      <Col>
      <h2>Log in to start planning events with all your friends!</h2>
      </Col>
      </Row>
      </>
    );
  }
}

export default connect(({events, session}) => ({events, session}))(Feed);
