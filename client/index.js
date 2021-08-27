import { request } from 'graphql-request';

var url = 'http://localhost:4000/graphql';

var mutation = `
  mutation populate($count: Int!){
    addFakeUsers(count: $count){
      id
      name
    }
  }
`;


var variables = { count: 3 };

request(url, mutation, variables)
  .then(console.log)
  .catch(console.error);