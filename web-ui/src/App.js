import './App.scss';
import { Switch, Route } from 'react-router-dom';

import { Container } from 'react-bootstrap';
import Nav from './Nav';
import Feed from './Feed';
import UsersList from './Users/List';
import UsersNew from './Users/New';
import EditUserPage from './Users/Edit';
import EventNew from './Events/New';
import EventPage from './Events/Show';
import EditEventPage from './Events/Edit';

function App() {
  return (
    <Container>
      <Nav />
      <Switch>
        <Route path="/events/new">
          <EventNew/>
        </Route>
        <Route path="/" exact>
          <Feed />
        </Route>
        <Route path="/events/:id" component={EventPage}/>
        <Route path="/events/:id/edit" component={EditEventPage}/>
        <Route path="/users/:id/edit" component={EditUserPage}/>
        <Route path="/users" exact>
          <UsersList />
        </Route>
        <Route path="/users/new">
          <UsersNew />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
