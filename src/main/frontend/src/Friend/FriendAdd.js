import { useState } from 'react';
import styled from 'styled-components';

const FriendFind = styled.div`
    overflow: hidden;
    transition: all .5s ease-in;
    height: 0px;
    p{
        height: 40px;
        cursor: text;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 5px;
        border: 2px solid #f9f9f9;
        transition: all .1s ease-in;
        input {
            width: 345px;
            border: none;
            outline: none;
            background-color: #f9f9f9;
        }
        span{
            font-size: 13px;
            line-height: 16px;
            color: #888;
            font-weight: 400;
        }
        &:focus-within{
            border: 2px solid #f0f0f0;
        }
    }
    button{
        cursor: pointer;
        padding: 5px 3px;
        margin: 5px 0;
        width: 100%;
        border: none;
        background-color: #333;
        border-radius: 5px;
        color: white;
        transition: all .1s ease-in;
        &:disabled, &:hover{
            background-color: #666;
            color: #aaa;
        }
    }
`;

const FriendAdd = ({setCommnet, setModalHeader, setModalOpen, isAdd}) => {
    const [addInput, setAddInput] = useState();
    const [inputMessage, setInputMessage] = useState(''); 
    const [isOk, setIsOk] = useState(true); 

    const onChangeAddInput = (e) => {
        const regex = /^([^#@:]\s?){2,32}#[0-9]{4}$/
        const current = e.target.value;
        setAddInput(current);
        if (!regex.test(current)) {
            setInputMessage('친구의 닉네임#유저코드 형식')
            setIsOk(true)
        } else {
            setInputMessage('')
            setIsOk(false);
        }
    }

    // 친구요청 버튼 팝업(수정해야함)
    const onClickAddBtn = () => {
        if(true) { // 자신의 친구 목록에 없고 유효한 사용자
            setCommnet("친구 신청이 되었습니다.");
            setModalHeader("친구신청");
        } else if(false) { //자신의 친구목록에 있음
            setCommnet("이미 친구 등록된 사용자입니다.");
            setModalHeader("친구신청 실패");
        } else { // 검색결과가 없는 유효하지 않은 사용자
            setCommnet("닉네임과 유저코드를 다시 확인해주세요.");
            setModalHeader("친구신청 실패");
        }
        setModalOpen(true);
    }

    return (
        <FriendFind className={isAdd? 'add_active_addbox' : ''}>
            <label>
                <p>
                    <input type="text" maxLength={25} placeholder='Nickname#0000' value={addInput} onChange={onChangeAddInput}/>
                    <span>{inputMessage}</span>
                </p>
            </label>
            <button disabled={isOk} onClick={onClickAddBtn}>친구요청</button>
        </FriendFind>
    );
}

export default FriendAdd;