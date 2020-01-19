import React, {Component} from 'react';

import AuthContext from '../context/auth-context';

import Spinner from '../components/Spinner/Spinner';

import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingChart/BookingChart';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';
import Api from '../apis/Api';

class BookingPage extends Component {
    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list'
    }

    static contextType = AuthContext;
    
    componentDidMount(){
        this.fetchBooking();
    }

    fetchBooking = async() => {
        this.setState({isLoading: true});
        try {
            const token = this.context.token; 
            const resData = await Api.getBookings(token);
            console.log(resData);
            const bookings = resData.data.bookings;
            this.setState({bookings: bookings, isLoading: false});
        }catch(err){
            console.log(err);
            this.setState({isLoading: false});
        }
    }

    deleteBookingHandler = async(bookingId) => {
        this.setState({isLoading: true});
        try{
            const token = this.context.token; 
            const resData = await Api.cancelBooking(bookingId, token);
            console.log(resData);
            this.setState(prevState => {
                const updatedBookings = prevState.bookings.filter(booking => {
                    return booking._id !== bookingId;
                });
                return {bookings: updatedBookings, isLoading: false};
            })
        }catch(err){
            console.log(err);
            this.setState({isLoading: false});
        }
    }

    changeTabHandler = outputType => {
        if(outputType === 'list'){
            this.setState({outputType: 'list'});
        }else {
            this.setState({outputType: 'chart'});
        }
    }

    render(){
        let content = <Spinner/>
        if(!this.state.isLoading){
            content = (
                <React.Fragment>
                    <BookingsControls 
                        activeOutputType={this.state.outputType}
                        onChange={this.changeTabHandler}/>
                    <div>
                        {this.state.outputType === 'list' ? (
                            <BookingList bookings={this.state.bookings}
                                        onDelete={this.deleteBookingHandler}/>
                        ) : (
                            <BookingsChart bookings={this.state.bookings}/>
                        )}
                    </div>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                {content}   
            </React.Fragment>
        );
    }
}

export default BookingPage;