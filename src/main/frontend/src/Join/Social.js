import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { ReactComponent as LogoImg } from "../Images/plannet-001.svg";
import styled from "styled-components";
import Api from '../api/plannetApi';
import Modal from '../Utill/Modal';
import "../App";
import "./Join.scss"

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

const Social = () => {
    const navigate = useNavigate();
    decodeURI(new URL(window.location.href));
    const id = new URL(window.location.href).searchParams.get("id");
    const name = new URL(window.location.href).searchParams.get("name");
    const email = new URL(window.location.href).searchParams.get("email");
    const regStatus = new URL(window.location.href).searchParams.get("regStatus");
    const [comment, setCommnet] = useState("");
    const [header, setHeader] = useState(""); 
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => {
        setModalOpen(false);
    };
    
    const [option, setOption] = useState("");
    const [inputNickname, setInputNickname] = useState("");
    const [inputTel, setInputTel] = useState("");

    // 오류 메시지
    const [nicknameMessage, setNicknameMessage] = useState("");
    const [telMessage, setTelMessage] = useState("");

    // 유효성 검사
    const [isNickname, setIsNickname] = useState(false);
    const [isTel, setIsTel] = useState(true);

    useEffect(() => {
        const socialLoginFindId = async() => { 
            const response = await Api.socialLoginFindId(email);
            window.localStorage.setItem("userId", response.data.substring(7));
            window.localStorage.setItem("isLogin", "true");
            navigate('/home');
        }
        if(regStatus === '0') {
            socialLoginFindId();
        } else if(regStatus === '1') { // 일반 회원
            setOption(email);
            setCommnet("구글 연동을 하시겠습니까? </br> 연동 후 구글 로그인으로만 로그인 가능합니다.");
            setHeader("구글 연동");
            setModalOpen(true);
        } else if(regStatus === '2') { // 구글로그인이 처음
        } else {
            setCommnet("구글 로그인에 실패했습니다.");
            setHeader("구글 로그인 실패");
            setModalOpen(true);
        }
    }, [email, id, navigate, regStatus])
 
    // 닉네임을 적었으면 해당 닉네임으로 저장
    const onChangeNickname = (e) => {
        setInputNickname(e.target.value);
    }
    const onBlurNicknameCheck = async() => {
        // 가입 여부 우선 확인
        const memberCheck = await Api.overlapCheck(inputNickname, "TYPE_NICKNAME");
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
        const memberCheck = await Api.overlapCheck(inputTel, "TYPE_TEL");
        if (memberCheck.data) {
            setTelMessage("사용가능한 전화번호입니다.");
            setIsTel(true)
        } else {
            setTelMessage("이미 사용하고 있는 전화번호입니다.");
            setIsTel(false)
        } 
    }
    
    const onClickJoin = async() => {
        const memberReg = await Api.memberNewSocialSave(id, name, email, inputNickname, inputTel);
        if(memberReg.data) {
            window.localStorage.setItem("userId", id);
            window.localStorage.setItem("isLogin", "true");
            navigate('/home');
        }
    }
    // ENTER 키를 눌렀을 때 회원가입 전송
    const onKeyPressEnter = (e) => {
        if(e.key === 'Enter'){
            onClickJoin();
        }
    }

    return (
        <>
            <ContainerJoin>
                <Modal open={modalOpen} close={closeModal} header={header} option={option}><p dangerouslySetInnerHTML={{__html: comment}}></p></Modal>
                {regStatus === '2'?  
                    <>
                        <Logo><LogoImg width="90px" viewBox="30 150 430 220"/><Link to="/" className="logo">Plannet</Link></Logo>
                        <div className="session">
                            <p>이름</p>
                            <input type='text'placeholder="이름" value={name} disabled/>
                        </div>
                        <div className="session">
                            <p>이메일</p>
                            <input type='email' placeholder="이메일" value={email} disabled/>
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
                                전화번호
                                {inputTel.length > 0 && <span>{telMessage}</span>}
                            </p>
                            <input type='tel' placeholder="휴대폰번호('-' 제외)" value={inputTel} onChange={onChangeTel} onBlur={onBlurTelCheck} onKeyDown={onKeyPressEnter}/>
                        </div>
                        <div className="session">
                            <button onClick={onClickJoin} disabled={!(isNickname && isTel)}>가입하기</button>
                        </div>
                    </>
                : ''}
            </ContainerJoin>
        </> 
    );
};

export default Social;