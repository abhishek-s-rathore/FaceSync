import { ADD_MESSAGE, ADD_HISTORY } from "./chatActions";

export const chatReducer =(state, action)=>{
     switch (action.type){
           case ADD_MESSAGE:{
            console.log(state, 'hey you')
            return {
               ...state,
               messages: [ ...(state?.messages), action.payload.message ]
           };
             }
          
        case ADD_HISTORY: {
               return {
                ...state,
                messages:  action.payload.history
               };
              }

      default: {
         return {...state};
      }
     }  
}