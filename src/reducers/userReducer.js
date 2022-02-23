const initialState=null
const reducer=(action,state)=>{
if(action.type=='USER'){
    return action.payload
}
return state
}

export {initialState,reducer}