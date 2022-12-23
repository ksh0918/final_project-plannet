import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Api from "../api/plannetApi";

const Memo = ({props}) => {
    const getId = window.localStorage.getItem("userId");
    let params = useParams(); // url에서 scalNo를 가져오기 위해 uesParams() 사용
    let getNum = params.no; // params는 객체이기 때문에 풀어줘서 다시 getNum에 대입해줌

    // 링크에서 home인지 scal인지 구분
    const currentLink = useLocation(); // 현재 링크 얻기
    const currentPath = currentLink.pathname; // Object 타입의 currentLink에서 pathname 정보 취득
    const [memoText, setMemoText] = useState('');
    
    const onChange = (e) => {
        setMemoText(e.target.value);
    };

    useEffect(() => {
        setMemoText(props);
    }, [props]);

    const onBlurSave = async() => {
        if(currentPath === "/home") {
            await Api.memoSave(getId, memoText);
        }
        else {
            console.log("여기 들어오긴 하니");
            await Api.scalMemoSave(getNum, memoText);
        }
    }
    console.log(currentPath);

    return (
        <textarea 
            placeholder="자유롭게 메모하세요."
            value={memoText}
            onChange={onChange}
            onBlur={onBlurSave}
            maxLength="2400"
        />
    );
};

export default Memo;