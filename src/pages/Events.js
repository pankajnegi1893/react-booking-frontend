import React, {Component} from 'react';

import './Event.css';

import Modal from '../components/Modal/Modal.js';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Event/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import Api from '../apis/Api';

class EventsPage extends Component {

    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    };

    isActive = true;

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
        this.descriptionEl = React.createRef();
    }

    componentDidMount(){
        this.fetchEvent();
    }

    fetchEvent = async () => {
        this.setState({isLoading: true});
        try {
            const events = await Api.getEvents();
            if(this.isActive){
                this.setState({events: events, isLoading: false});
            } 
        }catch(err) {
            if(this.isActive){
                this.setState({isLoading: false});
            } 
        }
    }

    startCreateEventHandler = () => {
        this.setState({creating: true});
    }

    modalCancelHandler = () => {
        this.setState({creating: false, selectedEvent: null});
    }

    modalConfirmHandler = async() => {
        this.setState({creating: false});
        const title = this.titleEl.current.value;
        const price = parseFloat(this.priceEl.current.value);
        const date = this.dateEl.current.value;
        const description = this.descriptionEl.current.value;

        if(title.trim().length === 0 || price <= 0 ||
        date.trim().length === 0 || description.trim().length === 0 ) {
            return;
        }
        const event = {title, price, date, description};

        console.log(event);
        try {
            const token = this.context.token; 
            const resData = await Api.createEvent(title, price, date, description, token);
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator : {
                        _id : this.context.userId
                    }
                })
                return {events: updatedEvents};
            })
        }catch(err) {
            console.log(err);
        }
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return {selectedEvent: selectedEvent};
        })
    }

    bookEventHandler = async() => {
        if(!this.context.token){
            this.setState({selectedEvent: null});
            return;
        }
        this.setState({creating: false});
        try {
            const token = this.context.token; 
            const resData = await Api.bookEvent(this.state.selectedEvent._id, token)
            console.log(resData);
            this.setState({selectedEvent: null});
        }catch(err) {
            console.log(err);
        }
    }

    componentWillUnmount(){
        this.isActive = false;
    }
    
    render(){
        return (
         <React.Fragment> 
            {(this.state.creating || this.state.selectedEvent) && <Backdrop/> }
            {this.state.creating && (
            <Modal title="Add Event" canCancel canConfirm 
                                    onCancel={this.modalCancelHandler}
                                    confirmText="Confim"
                                    onConfirm={this.modalConfirmHandler}>
                <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" ref={this.titleEl}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" ref={this.priceEl}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input type="datetime-local" id="date" ref={this.dateEl}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows="4" ref={this.descriptionEl}/>
                    </div>
                </form> 
            </Modal> )}
           
           {this.state.selectedEvent && (
               <Modal title="Add Event" 
                      canCancel 
                      canConfirm 
                      confirmText={this.context.token ? "Book" : "Confirm"}
                      onCancel={this.modalCancelHandler}
                      onConfirm={this.bookEventHandler}>
                    <h1>{this.state.selectedEvent.title}</h1>
                    <h2>{this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                    <p>{this.state.selectedEvent.description}</p>
                </Modal>
           )}
            {this.context.token && (
            <div className="events-control">
                <p>Share your own Events!</p>
                <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
            </div>
            )}
            {this.state.isLoading ? (
                <Spinner></Spinner>
            ) :  (
                <EventList events={this.state.events} 
                           authUserId={this.context.userId}
                           onViewDetail={this.showDetailHandler}/>
                ) 
            }
           
        </React.Fragment>  
        );
    }
}

export default EventsPage;