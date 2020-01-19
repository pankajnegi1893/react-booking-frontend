import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

 const eventList = props => {
   const events = props.events.map(event => {
        return (<EventItem key={event._id} 
                            eventId={event._id} 
                            title={event.title}
                            price={event.price}
                            date={event.date}
                            userId={props.authUserId}
                            onDetail={props.onViewDetail}
                            creatorId={event.creator._id}></EventItem>);
    });
   return ( <ul className="events__list">
        {events} 
    </ul>)
 };

 export default eventList;  