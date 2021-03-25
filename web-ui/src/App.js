import './App.scss';
import capitalize from 'lodash/capitalize';

import { Container } from 'react-bootstrap';
import Users from "./Users";

function App() {
  return (
    <Container>
      <Users />
    </Container>
  );
}

export default App;
