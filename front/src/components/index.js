import React from "react"
import {Route, Redirect, Switch} from "react-router-dom"
import Register from "./views/Register"
import Home from "./views/Home"

export default ()=>{
    return(
        // <Switch>
        //     <Route path="/register" component={Register}/>
        //     <Route exact to="/" component={Home}/>
        //     <Redirect to="/"/>
        // </Switch>
        <div>
            <img src="https://images.unsplash.com/2/02.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" />
        </div>
    )
}