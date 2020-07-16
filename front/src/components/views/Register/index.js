import React from "react"
import {Container} from "./style"
import Input from "../../common/Input"

export default ()=>{
    const margin="10px"
    return(
        <Container>
            <p>Register</p>
            <Input type={"email"} name={"email"} placeholder={"Email"} margin={margin} />
            <Input type={"text"} name={"email"} placeholder={"Username"} margin={margin}/>
            <Input type={"password"} name={"password"} placeholder={"Password"} margin={margin}/>
            <Input type={"text"} name={"firstName"} placeholder={"First Name"} margin={margin}/>
            <Input type={"text"} name={"lastName"} placeholder={"Last Name"} margin={margin}/>
        </Container>
    )
}