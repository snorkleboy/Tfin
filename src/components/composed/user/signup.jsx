import React from 'react';
import { Link } from 'react-router-dom';


// createUser
// login
// checkUserName
class Signup extends React.Component {
    constructor(props) {
        super(props);;
        this.state={username:'',password:'', checked:false, existingUser:false}
    }
    componentDidMount(){
        this.props.getMosts();
    }
    componentWillReceiveProps(newProps, newState) {
        console.log(newState);
        if (newProps.signedIn) {
            this.props.history.push("/stocks")
        }
    }
    handleUserName(e){this.setState({username:e.target.value}) }
    handlePassword(e) {this.setState({ password: e.target.value })    }
    handleCreateUser(e){this.props.createUser(this.state.username, this.state.password); }
    handleLogin(e) { this.props.login(this.state.username, this.state.password) }
    
    handleCheckUsername(e){this.props.checkUserName(this.state.username).then(res => this.setState({ existingUser: res.isUser,checked:true })) }
    

    render() {
        let label;
        let inputHandler;
        let submitHandler;   
        let message;
        if (!this.state.checked){
            message = "Welcome to Tfin"
            label = "Username";
            inputHandler =  this.handleUserName;
            submitHandler = this.handleCheckUsername;
        }else{
            message = this.state.existingUser ? `Hi ${this.state.username}, please enter your password` : "welcome, please SignUp with a password"
            label = "Password";
            inputHandler = this.handlePassword
            submitHandler = this.state.existingUser ?  this.handleLogin :this.handleCreateUser
        }
        return (
            <div className='Signup'>
                <section className='Credform'>
                    <h1>{message}</h1>
                    <label>{label}
                        <input onChange={inputHandler.bind(this)}/>
                    </label> 
                    <input onClick={submitHandler.bind(this)} type="submit"/>
                    <div className="errors">
                        {this.props.errors.error}
                    </div>
                </section>
            </div>
        );
    }
}
export default Signup;