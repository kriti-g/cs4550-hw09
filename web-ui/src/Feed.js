import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function Event({eve}) {
  return (
    <Col>
    <Card>
    <Card.Body>
    <Card.Title>{ eve.name }</Card.Title>
    <Card.Subtitle>{eve.date}</Card.Subtitle>
    <Card.Text>
    { eve.user.name}'s Event <br />
    {eve.desc}
    </Card.Text>
    </Card.Body>
    </Card>
    </Col>
  );
}

function Feed({events}) {
  let cards = events.map((eve) => <Event eve={eve} key={eve.id} />);
  return (
    <>
    <Row>
    <Col>
    <h2>Your Events</h2>
    <Link to="/posts/new">New Event</Link>
    </Col>
    </Row>
    <Row>
    { cards }
    </Row>
    </>
  );
}

export default connect(({events}) => ({events}))(Feed);
