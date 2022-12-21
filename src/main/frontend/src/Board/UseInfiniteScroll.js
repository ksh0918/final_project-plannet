import {useState, useEffect} from 'react';

// 콜백함수(Callback Function)란 파라미터로 함수를 전달받아, 함수의 내부에서 실행하는 함수 입니다.
// 여기에선 Comment.js에서 매개변수로 넣은 Comments
const useInfiniteScroll = (callback) => {
    // 스크롤 완료 여부
    const [isFetching, setIsFetching] = useState(false);

    // useEffect() 를 통해, Mounted 시(처음 나타났을 때)에 이벤트를 추가, Unmount(사라질 때) 시에 이벤트를 제거해준다.
    useEffect(() => {
        window.addEventListener('scroll', handleScroll); 
        return () => window.removeEventListener('scroll',handleScroll);
    },[]);

    useEffect(() => {
            if(!isFetching) return;
            callback(() => {
                console.log('Call Back!');
            })
    },[isFetching]) 

    // 스크롤 이벤트에 대한 핸들러 함수. height 계산을 통해 스크롤이 끝나면 로직을 실행한다.
    const handleScroll = () => { 
            // 스크롤해서 보이지 않는 높이          // 보이는 화면 높이                         // 전체 스크롤 높이                                        
       if (((document.documentElement.scrollTop + document.documentElement.clientHeight) >= document.documentElement.scrollHeight) && isFetching === false){ 
        setIsFetching(true);                                                                                                        
       }else{
        return;
       }
    }
    return [isFetching, setIsFetching];
}

export default useInfiniteScroll;