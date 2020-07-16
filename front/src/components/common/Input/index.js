import React from "react"
import styled from "styled-components"


const StyledInput = styled.input`
font-size: 30px;
border-radius: 20px;
height: 50px;
margin: ${props => props.margin} ;
`

const input = ({type, name, id, placeholder, onChange, margin}) => {
    return(
       <StyledInput type={type} id={id} name={name} placeholder={placeholder} onChange={onChange} margin={margin}></StyledInput>
    )
}

export default input