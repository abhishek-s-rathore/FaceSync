export const ADD_MESSAGE = "ADD_MESSAGE";
export const ADD_HISTORY = "ADD_HISTORY";


export const addMessage = ( message)=>{
    return{
        type:ADD_MESSAGE,
        payload:{message}
    }
}

export const addHistory = (history)=>{
    return{
        type:ADD_HISTORY,
        payload:{history}
    }
}