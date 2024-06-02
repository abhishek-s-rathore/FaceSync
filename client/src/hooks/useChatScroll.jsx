import React, {useEffect,useRef} from 'react';

function useChatScroll(chat){
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [chat]);

  return ref;
}


export default useChatScroll;