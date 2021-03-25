import { Row, Col, Card } from 'react-bootstrap';
import { connect } from 'react-redux';

function Event({eve}) {
  return (
    <Col>
      <Card>
        <Card.Title>{ eve.name }</Card.Title>
        <Card.Subtitle>{eve.date}</Card.Subtitle>
        <Card.Text>
          { eve.user.name}'s Event <br />
          {eve.desc}
        </Card.Text>
      </Card>
    </Col>
  );
}

function Feed({events}) {
  let cards = events.map((eve) => <Event eve={eve} key={eve.id} />);
  return (
    <Row>
      { cards }
    </Row>
  );
}

export default connect(({events}) => ({events}))(Feed);
