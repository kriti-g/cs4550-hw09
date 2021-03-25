import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react'
import { create_event } from '../api';

export default function EventsNew() {
  let [eve, setEvent] = useState({});

  function onSubmit(ev) {
    ev.preventDefault();
    console.log(ev);
    console.log(eve);
    create_event(eve);
  }

  function updateName(ev) {
    let e1 = Object.assign({}, eve);
    e1["name"] = ev.target.value;
    setEvent(e1);
  }

  function updateDesc(ev) {
    let e1 = Object.assign({}, eve);
    e1["desc"] = ev.target.value;
    setEvent(e1);
  }

  function updateDate(ev) {
    let e1 = Object.assign({}, eve);
    e1["date"] = ev.target.value;
    setEvent(e1);
  }

  // Note: File input can't be a controlled input.
  return (
    <Row>
      <Col>
        <h2>New Post</h2>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control as="text_input"
                          onChange={updateName}
                          value={eve.name} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Desc</Form.Label>
            <Form.Control as="textarea"
                          rows={4}
                          onChange={updateDesc}
                          value={eve.desc} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
