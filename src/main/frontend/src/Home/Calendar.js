import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import moment from "moment";
import 'react-calendar/dist/Calendar.css'; // css import
import './Calendar.css';

const Cal = ({doMark, endMark}) => {
    const navigate = useNavigate(); // navigate를 사용하기 위해 선언
    let params = useParams(); // url에서 calNo를 가져오기 위해 uesParams() 사용
    let getNum = params.no; // params는 객체이기 때문에 풀어줘서 다시 getNum에 대입해줌

    // 링크에서 home인지 scal인지 구분
    const currentLink = useLocation(); // 현재 링크 얻기
    const currentPath = currentLink.pathname; // Object 타입의 currentLink에서 pathname 정보 취득

    const [value, setValue] = useState(new Date());

    //날짜 클릭시 해당날짜의 write로 이동
    const dayIn = (value) => {
        const selectDate = moment(value).format('YYYY-MM-DD');
        if(currentPath === "/home") {
            const link = "/write/" + selectDate;
            navigate(link);
        }
        else {
            const noAndDate = getNum + "/" + selectDate 
            const link = "/scal/write/" + noAndDate;
            navigate(link);
        }
    }

    return (
        <div>
            <Calendar 
            returnValue="range"
            calendarType="US"
            onChange={setValue} 
            value={value} 
            onClickDay={dayIn}
            formatShortWeekday={(locale, value) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][value.getDay()]}
            formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
            minDetail="month"
            tileContent={({date, view}) => { // 날짜 타일에 컨텐츠 추가하기 (html 태그)
                let html = [];
                // 현재 날짜가 post 작성한 날짜 배열(mark)에 있다면, dot div 추가
                if (doMark.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
                    html.push(<div className="dotDo"></div>);
                }
                if (endMark.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
                    html.push(<div className="dotEnd"></div>);
                }
                return (
                    <>
                        <div className="dotBox">
                            {html}
                        </div>
                    </>
                );
            }}
            />
        </div>
    );
}

export default Cal;