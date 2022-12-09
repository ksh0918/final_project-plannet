import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as LogoImg } from "../Images/planet-001.svg";
import Api from '../api/plannetApi';
import "./Join.scss"
import "../App";
import { useNavigate  } from "react-router-dom";
import Modal from '../Utill/Modal';


const ContainerJoin = styled.div`
    height: 100vh;
    display:flex ;
    justify-content:center;
    align-items: center;
    flex-direction: column;
    background-color: white;
`;
const Logo = styled.div`
    margin-top: -30px;
    a {
        font-family: 'Comfortaa', cursive;
        font-size: 67px;
        font-weight: bold;
        color: #4555AE;
    }
`;

const Join = () => {
    const navigate = useNavigate();
    const id = new URL(window.location.href).searchParams.get("id");
    const regStatus = new URL(window.location.href).searchParams.get("regStatus");
    const [comment, setCommnet] = useState("");
        const [modalOpen, setModalOpen] = useState(false);
        const closeModal = () => {
            setModalOpen(false);
    };

    const [info, setInfo] = useState("");
    const [inputNickname, setInputNickname] = useState("");
    const [inputTel, setInputTel] = useState("");

    // 오류 메시지
    const [nicknameMessage, setNicknameMessage] = useState("");
    const [telMessage, setTelMessage] = useState("");

    // 유효성 검사
    const [isNickname, setIsNickname] = useState(false);
    const [isTel, setIsTel] = useState(true);

    useEffect(() => {
        const newSocial = async() => {
            try{
                const response = await Api.memberNewSocialLoad(id);
                setInfo(response.data);
            } catch(e){
            console.log(e);
            }
        }

        if(regStatus === 0) {
            window.localStorage.setItem("userId", id);
            window.localStorage.setItem("isLogin", "true");
            navigate('/home');
        } else if(regStatus === 1) { // 일반 회원
            setModalOpen(true);
            setCommnet("구글 연동을 하시겠습니까? </br> 연동 후 구글 로그인으로만 로그인 가능합니다.");
        } else if(regStatus === 2) { // 구글로그인이 처음
            newSocial();
        } else {
            setModalOpen(true);
            setCommnet("구글 로그인에 실패했습니다.");
        }
    },[id, navigate, regStatus])
 
    // 닉네임을 적었으면 해당 닉네임으로 저장
    const onChangeNickname = (e) => {
        setInputNickname(e.target.value);
    }
    const onBlurNicknameCheck = async() => {
        // 가입 여부 우선 확인
        const memberCheck = await Api.memberRegCheck(inputNickname, "TYPE_NICKNAME");
        if (memberCheck.data && inputNickname.length > 0) {
            setNicknameMessage("사용가능한 닉네임입니다.");
            setIsNickname(true);
        } else {
            setNicknameMessage("이미 사용하고 있는 닉네임입니다.");
            setIsNickname(false);
        } 
    }
    const onChangeTel = (e) => {
    setInputTel(e.target.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
    }
    const onBlurTelCheck = async() => {
        // 가입 여부 우선 확인
        const memberCheck = await Api.memberRegCheck(inputTel, "TYPE_TEL");
        if (memberCheck.data) {
            setTelMessage("사용가능한 전화번호입니다.");
        } else {
            setTelMessage("이미 사용하고 있는 전화번호입니다.");
            setIsTel(false)
        } 
    }
    // ENTER 키를 눌렀을 때 회원가입 전송
    const onKeyDownJoin = (e) => {
        if(e.key === 'Enter'){
            onClickJoin();
        }
    }
    const onClickJoin = async() => {
        const memberReg = await Api.memberNewSocialSave(id, inputNickname, inputTel);
        if(memberReg.data) {
            window.localStorage.setItem("userId", id);
            window.localStorage.setItem("isLogin", "true");
            navigate('/home');
        }
    }
    return(
        <>
            <ContainerJoin>
                <Modal open={modalOpen} close={closeModal} header="구글로그인 실패">{comment}</Modal>
                <Logo><LogoImg width="90px" viewBox="30 150 430 220"/><Link to="/" className="logo">Plannet</Link></Logo>
                <div className="session">
                    <p>이름*</p>
                    <input type='text'placeholder="이름" value={info[0]} readonly/>
                </div>
                <div className="session">
                    <p>
                        닉네임*
                        {inputNickname.length > 0 && <span>{nicknameMessage}</span>}
                    </p>
                    <input type='text' placeholder="닉네임" value={inputNickname} onChange={onChangeNickname} onBlur={onBlurNicknameCheck} maxLength={20}/>
                </div>
                <div className="session">
                    <p>
                        이메일*
                    </p>
                    <input type='email' placeholder="이메일" value={info[1]} readonly/>
                </div>
                <div className="session">
                    <p>
                        전화번호
                        {inputTel.length > 0 && <span>{telMessage}</span>}
                    </p>
                    <input type='tel' placeholder="휴대폰번호('-' 제외)" value={inputTel} onChange={onChangeTel} onBlur={onBlurTelCheck} onKeyDown={onKeyDownJoin}/>
                </div>
                <div className="session">
                    <button onClick={onClickJoin} disabled={!(isNickname && isTel)}>가입하기</button>
                </div>
            </ContainerJoin>
        </> 
    );
};

export default Join;