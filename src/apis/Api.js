
const END_POINT = 'http://localhost:8000/graphql';

const QUERY_LOGIN = `
                    query Login($email: String!, $password: String!){
                        login(email: $email, password: $password) {
                            userId
                            token
                            tokenExpiration
                        }
                    }
                    `;
const MUTATION_CREATE_USER =  `
                        mutation CreateUser($email: String!, $password: String!){
                            createUser(userInput: {email: $email, password: $password}) {
                                _id
                                email
                            }
                        }
                        `;
const QUERY_GET_EVENTS = `
                    query {
                        events {
                            _id
                            title
                            description
                            date
                            price
                            creator {
                                _id
                                email
                            }
                        }
                    }`;

const MUTATION_CREATE_EVENT = `
                    mutation createEvent($title: String!, $price: Float!, $date: String!, $desc: String!){
                    createEvent(eventInput: {title: $title, price: $price, date: $date, description: $desc}) {
                            _id
                            title
                            description
                            date
                            price
                    }
                }`;
const MUTATION_BOOK_EVENT = `
                mutation BookEvent($id: ID! ){
                    bookEvent(eventId: $id) {
                        _id
                        createdAt
                        updatedAt
                    }
                }`;

const QUERY_GET_BOOKINGS = `
                    query {
                        bookings {
                            _id
                            createdAt
                            updatedAt
                            event {
                                _id
                                title
                                date
                                price
                            }
                        }
                    }`;

const MUTATION_CANCEL_BOOKING = `
                    mutation CancelBooking($id: ID!){
                        cancelBooking(bookingId: $id) {
                            _id
                            title
                        }
                    }`;
const Api = {
    basicRequest: async function(requestBody, token){
        try {
            let headers = {
                'Content-Type': 'application/json',
            }
            if(token !== undefined){
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' + token
                }
            }
            console.log("headers :- ", headers);
            const res = await fetch(END_POINT, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: headers
            });
            // if(res.status !== 200 && res.status !== 201){
            //     //throw new Error('Failed');
            // }
            const resBody = await res.json();
            console.log(resBody);
            return resBody;
        }catch(err){
            console.log(err);
            throw err;
        }
    },
    authUser: async function(email, password, isLogin){
        const variables = { email: email, password: password }
        let requestBody = {
            query: QUERY_LOGIN,
            variables: variables
        };
        if(!isLogin) {
            requestBody = {
                query: MUTATION_CREATE_USER,
                variables: variables
            };
        }
        try {
            const resBody = await this.basicRequest(requestBody, undefined);
            return resBody;
        }catch(err){
            console.log(err);
            throw err;
        }
    },

    getEvents: async function(){
        const requestBody = {
            query: QUERY_GET_EVENTS
        };
        try {
            const resData = await this.basicRequest(requestBody, undefined);
            console.log(resData);
            const events = resData.data.events;
            return events;
        }catch (err) {
            console.log(err);
            return err;
        }
    },

    createEvent: async function(title, price, date, desc, token) {
        const variables = {  
            title: title,
            price: price,
            date: date,
            desc: desc 
        }
        const requestBody = {
            query: MUTATION_CREATE_EVENT,
            variables: variables
        };

        try {
            const resData = await this.basicRequest(requestBody, token);
            return resData;
        }catch(err){
            throw err;
        }
    },
    bookEvent: async function(eventId, token) {
        const variables = {  
            id: eventId,
        }
        const requestBody = {
            query: MUTATION_BOOK_EVENT,
            variables: variables
        };

        try {
            const resData = await this.basicRequest(requestBody, token);
            return resData;
        }catch(err){
            throw err;
        }
    },
    getBookings: async function(token) {
        const requestBody = {
            query: QUERY_GET_BOOKINGS
        };
        try {
            const resData = await this.basicRequest(requestBody, token);
            return resData;
        }catch (err) {
            console.log(err);
            return err;
        }
    },
    cancelBooking: async function(bookingId, token) {
        const variables = {  
            id: bookingId,
        }
        const requestBody = {
            query: MUTATION_CANCEL_BOOKING,
            variables: variables
        };
        try {
            const resData = await this.basicRequest(requestBody, token);
            return resData;
        }catch(err){
            return err;
        }
    }
}

export default Api;