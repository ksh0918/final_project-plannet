import React, { useState, useEffect } from 'react';
import Api from "../api/plannetApi";


const Memo = ({props}) => {
    const getId = window.localStorage.getItem("userId");
    const [memoText, setMemoText] = useState('');
    
    const onChange = (e) => {
        setMemoText(e.target.value);
    };

    useEffect(() => {
        setMemoText(props);
    },[props]);

    const onBlurSave = async() => {
        await Api.memberMemoSave(getId, memoText);
    }

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