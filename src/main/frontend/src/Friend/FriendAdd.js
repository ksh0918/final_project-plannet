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
        position: relative;
        input {
            border: none;
            outline: none;
            background-color: #f9f9f9;
        }
        span{
            font-size: 13px;
            line-height: 16px;
            color: #888;
            font-weight: 400;
            position: absolute;
            right: 10px;
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

const FriendAdd = ({setCommnet, setModalHeader, setModalOpen, isAdd, getId}) => {
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

    const onClickAddBtn = async() => {
        console.log(getId, addInput);
        const response = await Api.notiAddFriend(getId, addInput);
        if(response.data === 1) { // 자신의 친구 목록에 없고 유효한 사용자
            setCommnet("친구 신청이 되었습니다.");
            setModalHeader("친구신청");
            setAddInput("");
        } else if(response.data === 2) { //자신의 친구목록에 있음
            setCommnet("이미 친구 등록된 사용자입니다.");
            setModalHeader("친구신청");
        } else if(response.data === 3) { //이미 내가 친구 신청함
            setCommnet("이미 친구 요청한 사용자입니다.");
            setModalHeader("친구신청");
        } else if(response.data === 4) { //이미 상대가 친구 신청함
            setCommnet("친구 요청이 있는 사용자입니다. </br>알림창을 확인해주세요.");
            setModalHeader("친구신청");
        } else if(response.data === 5) { //본인에게 친구신청
            setCommnet("본인에게 친구 요청할 수 없습니다.");
            setModalHeader("친구신청");
        } else { // 검색결과가 없는 유효하지 않은 사용자
            setCommnet("닉네임과 유저코드를 다시 확인해주세요.");
            setModalHeader("친구신청");
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
                    <input type="text" maxLength={25} placeholder='Nickname#0000' value={addInput} onChange={onChangeAddInput} onKeyDown={onKeyPressEnter} style={inputMessage.length>0? {width: 'calc(100% - 160px)'} : {width: '100%'}}/>
                    <span>{inputMessage}</span>
                </p>
            </label>
            <button disabled={isOk} onClick={onClickAddBtn}>친구요청</button>
        </FriendFind>
    );
}

export default FriendAdd;