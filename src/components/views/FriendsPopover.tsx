import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { api, handleError } from "../../helpers/api.js"
import InviteFriend from "../../hooks/InviteFriend";
import { useCurrentPath } from "../routing/routers/LocationContext.js";
import { Context } from "../../context/Context";
import "../../styles/views/FriendsPopover.scss";
import logoPic3 from './plus.png';

const FriendsPopover = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [requests, setRequests] = useState([]);
  const userId = parseInt(sessionStorage.getItem("userId"), 10);
  const { currentPath } = useCurrentPath();
  const context = useContext(Context);
  const {stompApi} = context;  

  // getting the gameId from the url
  const location = useLocation();
  const pathname = location.pathname;
  const gameId = pathname.split("/")[2];

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchFriendsData = async () => {
    try {
      console.log("getting friends");
      const friendsResponse = await api.get(`/users/${userId}/friends`);
      console.log("friendsResponse.data = ", friendsResponse.data);
      setFriends(friendsResponse.data);

      console.log("getting pending");
      const pendingResponse = await api.get(`/users/${userId}/openfriendrequests`);
      console.log("pendingResponse.data = ", pendingResponse.data);
      setPending(pendingResponse.data);

      console.log("getting requests");
      const requestsResponse = await api.get(`/users/${userId}/sentfriendrequests`);
      console.log("requestsResponse.data = ", requestsResponse.data);
      setRequests(requestsResponse.data);
    } catch (error) {
      console.error("Error fetching friends data: ", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFriendsData();
    }
  }, [isOpen]); // friends, pending, requests, 
 
  const invite = (friendId) => {
    console.log("friendId = ", friendId, "stompApi = ", stompApi, "gameId = ", gameId);
    const props = { friendId: friendId, gameId: gameId, stompApi: stompApi };
    InviteFriend(props)
  };

  const deleteFriend = async (friendUsername) => {
    try {
      await api.put(`/users/${userId}/friends`, null, {
        params: { friend_username: friendUsername } // friend_username: friendUsername
      });
      setFriends(friends.filter(friend => friend.username !== friendUsername));
    } catch (error) {
      console.error("Error deleting friend: ", error);
    }
  };

  const acceptOrDenyFriend = async (friendUsername, acceptOrDeny) => {
    try {
      await api.put(`/users/${userId}/openfriendrequests`, null, {
        params: { friend_username: friendUsername, false_for_deny_true_for_accept: acceptOrDeny }
      });
      setPending(pending.filter(friend => friend.username !== friendUsername));
      if (acceptOrDeny) {
        // Find the accepted friend in the pending list
        const acceptedFriend = pending.find(friend => friend.username === friendUsername);
        // Add the accepted friend to the friends list
        setFriends([...friends, acceptedFriend]);
      }
    } catch (error) {
      console.error("Error accepting or denying friend request: ", error);
    }
  };

  const deleteRequest = async (friendUsername) => {
    try {
      await api.post(`/users/${userId}/openfriendrequests`, null, {
        params: { friend_username: friendUsername, delete: true }
      });
      setRequests(requests.filter(friend => friend.username !== friendUsername));
    } catch (error) {
      console.error("Error deleting friend request: ", error);
    }
  };

  return (
    <div className="FriendsPopover popover-container" ref={popoverRef}>
      <div onClick={togglePopover}>
        {trigger}
      </div>
      {isOpen && (
        <div className="FriendsPopover popover-content">
          <div className="FriendsPopover column">
            <div className="FriendsPopover title">Friends</div>
            <div className="FriendsPopover friends-group">
              {friends.map((friend) => (
                <div key={friend.id} className="FriendsPopover form">
                  <div className="FriendsPopover username">
                    {friend.username}
                  </div>
                  {currentPath.includes("lobby") && (
                    <div className="FriendsPopover invite">
                      <img className="FriendsPopover img" src={logoPic3} onClick={() => invite(friend.id)}/>
                    </div>
                  )}
                  <div className="FriendsPopover cross" onClick={() => deleteFriend(friend.username)}>❌</div>
                </div>
              ))}
            </div>
          </div>
          <div className="FriendsPopover column">
            <div className="FriendsPopover title">Pending</div>
            <div className="FriendsPopover friends-group">
              {pending.filter(pendingFriend => !friends.some(friend => friend.username === pendingFriend.username)).map((pendingFriend) => (
                <div key={pendingFriend.id} className="FriendsPopover form">
                  <div className="FriendsPopover username">
                    {pendingFriend.username}
                  </div>
                  <div className="FriendsPopover check" onClick={() => acceptOrDenyFriend(pendingFriend.username, true)}>✅</div>
                  <div className="FriendsPopover cross" onClick={() => acceptOrDenyFriend(pendingFriend.username, false)}>❌</div>
                </div>
              ))}
            </div>
          </div>
          <div className="FriendsPopover column">
            <div className="FriendsPopover title">Requests</div>
            <div className="FriendsPopover friends-group">
              {requests.filter(requestFriend => !friends.some(friend => friend.username === requestFriend.username)).map((requestFriend) => (
                <div key={requestFriend.id} className="FriendsPopover form">
                  <div className="FriendsPopover username">
                    {requestFriend.username}
                  </div>
                  <div className="FriendsPopover cross" onClick={() => deleteRequest(requestFriend.username)}>❌</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPopover;
