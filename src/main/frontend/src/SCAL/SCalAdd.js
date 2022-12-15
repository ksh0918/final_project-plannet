import { useState } from 'react';
import styled from 'styled-components';
import Api from "../api/plannetApi";

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

const SCalAdd = ({setComment, setModalHeader, setModalOpen, isAdd, getId}) => {
    const [addInput, setAddInput] = useState();
    const [inputMessage, setInputMessage] = useState(''); 
    const [isOk, setIsOk] = useState(true); 

    const onChangeAddInput = (e) => {
        const regex = /^([^#@:]\s?){2,32}#[0-9]{4}$/
        const current = e.target.value;
        setAddInput(current);
        if (!regex.test(current)) {
            // setInputMessage('멤버의 닉네임#유저코드 형식')
            setIsOk(true)
        } else {
            setInputMessage('')
            setIsOk(false);
        }
    }

    const onClickAddBtn = async() => {
        console.log(getId, addInput);
        const response = await Api.scalAddMember(getId, addInput);
        if(response.data === 1) { // 자신의 친구 목록에 있는 사용자
            setComment("멤버 신청이 되었습니다.");
            setModalHeader("멤버신청");
            setAddInput("");
        } else if(response.data === 2) { //자신의 친구목록에 없는 사용자
            setComment("친구 등록이 되지 않은 사용자입니다.");
            setModalHeader("멤버신청");
        } else if(response.data === 3) { // 이미 공유 캘린더에 등록되어 있음
            setComment("이미 등록된 멤버 입니다.");
            setModalHeader("멤버신청");
        } else if(response.data === 4) { //이미 내가 멤버 요청함
            setComment("이미 멤버 요청한 친구 입니다.");
            setModalHeader("멤버신청");
        } else if(response.data === 5) { //이미 상대가 멤버 신청함
            setComment("멤버 요청이 있는 친구입니다. </br>알림창을 확인해주세요.");
            setModalHeader("멤버신청");
        } else { // 검색결과가 없는 유효하지 않은 사용자
            setComment("닉네임과 유저코드를 다시 확인해주세요.");
            setModalHeader("멤버신청");
        }
        setModalOpen(true);
    }

    const onKeyPressEnter = (e) => {
        if(e.key === 'Enter'){
            onClickAddBtn();
        }
    }

    return (
        <FriendFind className={isAdd? 'add_active_addbox' : ''}>
            <label>
                <p>
                    <input type="text" maxLength={25} placeholder='Nickname#0000' value={addInput} onChange={onChangeAddInput} onKeyDown={onKeyPressEnter}/>
                    <span>{inputMessage}</span>
                </p>
            </label>
            <button disabled={isOk} onClick={onClickAddBtn}>멤버요청</button>
        </FriendFind>
    );
}

export default SCalAdd;