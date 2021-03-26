import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function UsersList({users, session}) {
  let rows = users.map((user) => {
    let url = "/edituser/" + user.id;
    let control = (session && session.user_id == user.id) ? (<Link to={url}>Edit</Link>) : (<></>)
    return (<tr key={user.id}>
      <td>{user.name}</td>
      <td>{control}</td>
    </tr>);
  });

  return (
    <div>
      <Row>
        <Col>
          <h2>List Users</h2>
          <p>
            <Link to="/users/new">
              New User
            </Link>
          </p>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              { rows }
            </tbody>
          </table>
        </Col>
      </Row>
    </div>
  );

}

function state2props({users, session}) {
  return { users, session };
}

export default connect(state2props)(UsersList);
