import React from 'react';
import { Query, Mutation } from 'react-apollo';

import { ROOT_QUERY, ADD_FAKE_USERS_MUTATION } from '../graphql';

const Users = () =>
  <Query query={ROOT_QUERY} pollInterval={8000}>
    {({ data, loading, refetch }) => loading? <p>사용자 불러오는 중...</p>:
      <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />
    }
  </Query>
;

const UserList = ({ count, users, refetchUsers }) =>
  <div>
    <p>{count} Users</p>
    <button onClick={() => refetchUsers()}>다시가져오기</button>
    <Mutation mutation={ADD_FAKE_USERS_MUTATION} variables={{ count: 1}} refetchQueries={[{ query: ROOT_QUERY }]}>
      {
        addFakeUsers => <button onClick={addFakeUsers}>임시 사용자 추가</button>
      }
    </Mutation>
    <ul>
      {users.map(user =>
        <UserListItem key={user.githubLogin}
          name={user.name}
          avatar={user.avatar} />
      )}
    </ul>
  </div>
;

const UserListItem = ({ name, avatar }) => 
  <li>
    <img src={avatar} width={48} height={48} alt="" />
    {name}
  </li>
;

export default Users;