import React, { useState, useRef, useEffect } from "react";
import { api, handleError } from "../../helpers/api.js"
import "../../styles/ui/Popover.scss"


const Popover = ({ trigger, content, playerId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const userId = parseInt(sessionStorage.getItem("userId"), 10);
  const [isFriend, setIsFriend] = useState(true);

  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  };

  const fetchFriendsData = async () => {
    const friendsResponse = await api.get(`/users/${userId}/friends`);
    console.log("fetching... ", friendsResponse.data.some(friend => friend.id === playerId))
    await timeout(500);
    const dataToSet = friendsResponse.data.some(friend => friend.id === playerId)
    setIsFriend(dataToSet);
    console.log("isFriend in fetching... ", isFriend)
  };


  const togglePopover = async () => {
    fetchFriendsData();
    await timeout(600);
    console.log("isFriend ", isFriend)
    // console.log("disabled ", disabled)
    // if (disabled) return;
    if (!isFriend && userId >= 0 && playerId >= 0 && userId !== playerId) { // !isFriend 
      setIsOpen(!isOpen);
    }
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

  const closepopover = () => {
    setIsOpen(false);
  };

  return (
    <div className="Popover popover-container" ref={popoverRef}>
      <div onClick={togglePopover}>
        {trigger}
      </div>
      {isOpen && (
        <div className="Popover popover-content">
          {content({ closepopover })}
        </div>
      )}
    </div>
  );
};

export default Popover;