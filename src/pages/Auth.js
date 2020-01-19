import React, {Component} from 'react';
import './Auth.css';

import AuthContext from '../context/auth-context';
import Api from '../apis/Api';

class AuthPage extends Component {

    state = {
        isLogin: true
    }

    static contextType = AuthContext;
    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    submitHandler = async (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }
        console.log(email, password);
        try {
           const resBody = await Api.authUser(email, password, this.state.isLogin);
           if(resBody.data != null){
            if(resBody.data.login != null && resBody.data.login.token){ 
                this.context.login(resBody.data.login.token, 
                                    resBody.data.login.userId,
                                    resBody.data.login.tokenExpiration)
            }else if(resBody.data.createUser != null) {
                alert("User Created successfully. You can login now");
            }else {
                alert(resBody.errors[0].message);
            }
           }else {
               alert(resBody.errors[0].message);
           }
           
        }catch(err){
           alert(err);
        }
    };

    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin };
        })
    }
    
    render(){
        return (
        <form className="auth-form" onSubmit={this.submitHandler}>
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" ref={this.emailEl}/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordEl}/>
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={this.switchModeHandler}>Switch  to {this.state.isLogin ? 'Signup' : 'Login'}</button> 
            </div>
        </form>
        );
    }
}

export default AuthPage;