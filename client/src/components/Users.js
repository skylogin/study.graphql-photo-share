import React from 'react';
import { Query, Mutation } from 'react-apollo';

import { ROOT_QUERY, ADD_FAKE_USERS_MUTATION } from '../graphql';

const Users = () =>
  <Query query={ROOT_QUERY} fetchPolicy="cache-and-network">
    {({ data, loading, refetch }) => loading? <p>사용자 불러오는 중...</p>:
      <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />
    }
  </Query>
;

const updateUserCache = (cache, { data: { addFakeUsers } }) => {
  let data = cache.readQuery({ query: ROOT_QUERY });

  data.totalUsers += addFakeUsers.length;
  data.allUsers = [
    ...data.allUsers,
    ...addFakeUsers,
  ];

  // 캐시에 다시 쓰는건데, 이후로 캐시에서 다시 불러들이는 update가 안됨
  // apollo가 apollo client로 변경되면서 api가 삭제된 모양
  cache.writeQuery({ query: ROOT_QUERY, data });
  
}

const UserList = ({ count, users, refetchUsers }) =>
  <div>
    <p>{count} Users</p>
    <button onClick={() => refetchUsers()}>다시가져오기</button>
    <Mutation mutation={ADD_FAKE_USERS_MUTATION} variables={{ count: 1}} update={updateUserCache}>
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