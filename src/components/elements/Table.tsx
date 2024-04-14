import React, { useState } from "react";
import "styles/views/Table.scss"

const UserTable = () => {
  // const [users, setUsers] = useState([]);

  // const createUser = (lobbyName) => {
  //   // When creating a user, add them to the list of users
  //   const newUser = {
  //     lobbyName: lobbyName,
  //     username: "User" // Here you should get the username entered during login
  //   };
  //   setUsers([...users, newUser]);
  // };

  return (
    <div className="Table container">
      <h2>User Table</h2>
      <table>
        <thead>
          <tr>
            <th>Lobby</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {/* {users.map((user, index) => (
            <tr key={index}>
              <td>{user.lobbyName}</td>
              <td>{user.username}</td>
            </tr>
          ))} */}
          <tr>
            <td>Simon&apos;s lobby</td>
            <td>Simon The GOAT</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
