import React, { useState } from 'react';
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

const Join = () => {
    const navigate = useNavigate();
    // 키보드 입력
    const [inputId, setInputId] = useState("");
    const [inputPw, setInputPw] = useState("");
    const [inputConPw, setInputConPw] = useState("");
    const [inputName, setInputName] = useState("");
    const [inputNickname, setInputNickname] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputTel, setInputTel] = useState("");
    const [inputAuth,setInputAuth] = useState("");
    const [authNum,setAuthNum] = useState("");
 
    // 오류 메시지
    const [idMessage, setIdMessage] = useState("");
    const [pwMessage, setPwMessage] = useState("");
    const [conPwMessage, setConPwMessage] = useState("");
    const [nicknameMessage, setNicknameMessage] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [telMessage, setTelMessage] = useState("");
 
    // 유효성 검사
    const [isId, setIsId] = useState(false);
    const [isPw, setIsPw] = useState(false)
    const [isConPw, setIsConPw] = useState(false);
    const [isName, setIsName] = useState(false);
    const [isNickname, setIsNickname] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [isTel, setIsTel] = useState(false);
    const [isAuth,setIsAuth] = useState(false);
    const [clickAuth, setClickAuth] = useState(false);
 
    // ID 길이 체크
    const onChangId = (e) => {
        setInputId(e.target.value)
        if (e.target.value.length < 5 || e.target.value.length > 12) {
            setIdMessage("5자리 이상 12자리 미만으로 입력해 주세요.");
            setIsId(false);    
        } else {
            setIdMessage("올바른 형식입니다.");
            setIsId(true);
        }
    }
    // 중복 체크
    const onBlurIdCheck = async() => {
        // 가입 여부 우선 확인
        const memberCheck = await Api.overlapCheck(inputId, "TYPE_ID");
        if (memberCheck.data && isId) {
            setIdMessage("사용가능한 ID입니다.");
        } else if(memberCheck.data && !isId){
            setIdMessage("5자리 이상 12자리 미만으로 입력해 주세요.");
        }
        else {
            setIdMessage("이미 사용하고 있는 ID입니다.");
            setIsId(false);
        } 
    }

    // 비밀번호 정규식 체크
    const onChangePw = (e) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/
        const passwordCurrent = e.target.value ;
        setInputPw(passwordCurrent);
        if (!passwordRegex.test(passwordCurrent)) {
            setPwMessage('숫자+영문자 조합으로 8자리 이상 입력해 주세요.')
            setIsPw(false)
        } else {
            setPwMessage('안전한 비밀번호에요 :)')
            setIsPw(true);
        }
        if (passwordCurrent !== inputConPw) {
            setConPwMessage('비밀번호가 일치하지 않습니다.')
            setIsConPw(false)   
        }
    }
    // 비밀번호 확인 체크
    const onChangeConPw = (e) => {
        const passwordCurrent = e.target.value ;
        setInputConPw(passwordCurrent)
        if (passwordCurrent !== inputPw) {
            setConPwMessage('비밀번호가 일치하지 않습니다.')
            setIsConPw(false)
        } else {
            setConPwMessage('비밀번호가 일치 합니다.')
            setIsConPw(true);
        }      
    }
    
    const onChangeName = (e) => {
        setInputName(e.target.value);
        if(e.target.value.length > 0) setIsName(true);
    }
    
    const onChangeNickname = (e) => {
        setInputNickname(e.target.value);
    }
    
    // 이메일 확인 체크
    const onChangeEmail = (e) => {
        const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const emailCurrent = e.target.value ;
        setInputEmail(emailCurrent);
        if(!emailRegex.test(emailCurrent)){
            setEmailMessage('이메일의 형식이 올바르지 않습니다.')
            setIsEmail(false);
        } else {
            setEmailMessage('이메일의 형식이 올바르게 입력되었습니다.')
            setIsEmail(true);
        }
    }
    // 이메일 인증번호 받기
    const onClickAuth = async() => {
        setModalOpen(true);
        setComment("인증번호가 발행되었습니다.")
        const emailAuth = await Api.emailAuthCheck(inputEmail);
        setClickAuth(true);
        setAuthNum(emailAuth.data);
    }
    // 이메일 인증번호 확인
    const onCheckAuth = async() => {
        if(authNum === inputAuth){
            setEmailMessage("인증이 완료되었습니다.")
            setIsAuth(true)
        }
        else{
            setEmailMessage("인증이 완료되지 않았습니다.")
            setIsAuth(false)
        }
    }
    
    const onChangeAuth = (e) => {
        setInputAuth(e.target.value)
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

    const onBlurEmailCheck = async() => {
        // 가입 여부 우선 확인
        const memberCheck = await Api.overlapCheck(inputEmail, "TYPE_EMAIL");
        if (memberCheck.data && isEmail) {
            setEmailMessage("사용가능한 Email입니다.");
            setClickAuth(true);
        } else {
            setEmailMessage("이미 사용하고 있는 Email입니다.");
            setClickAuth(false);
            setIsEmail(false);
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
            setIsTel(true);
        } else {
            setTelMessage("이미 사용하고 있는 전화번호입니다.");
            setIsTel(false)
            
        } 
    }

    // ENTER 키를 눌렀을 때 회원가입 전송
    const onKeyPressEnter = (e) => {
        if(e.key === 'Enter'& ((isId && isPw && isConPw && isName && isNickname &&isEmail && isAuth && isTel)===true)){
            onClickJoin();
        }
    }

    const onClickJoin = async() => {
        const memberReg = await Api.memberReg(inputId, inputPw, inputName, inputNickname, inputEmail, inputTel);
        if(memberReg.data) {
            window.localStorage.setItem("userId", inputId);
            window.localStorage.setItem("isLogin", "true");
            navigate('/home');
        }
    }

    const [comment, setComment] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => {
        setModalOpen(false);
    }

    return (
        <ContainerJoin id="join">
            <Modal open={modalOpen} close={closeModal} header="글쓰기 안내">{comment}</Modal>
            <Logo><LogoImg width="90px" viewBox="30 150 430 220"/><Link to="/" className="logo">Plannet</Link></Logo>
            <div className="session">
                <p>
                    아이디*
                    {inputId.length > 0 && <span>{idMessage}</span>}
                </p>
                <input placeholder="아이디" value ={inputId} onChange={onChangId} type={'text'} onBlur={onBlurIdCheck}/>
            </div>
            <div className="session">
                <p>
                    비밀번호*
                    {inputPw.length > 0 && <span>{pwMessage}</span>}
                </p>
                <input type='password' placeholder="패스워드" value ={inputPw} onChange={onChangePw}/>
            </div>
            <div className="session">
                <p>
                    비밀번호 확인
                    {inputPw.length > 0 && <span>{conPwMessage}</span>}
                </p>
                <input type='password' placeholder="패스워드 확인" value={inputConPw} onChange={onChangeConPw}/>
            </div>
            <div className="session">
                <p>이름*</p>
                <input type='text'placeholder="이름" value={inputName} onChange={onChangeName} maxLength={30}/>
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
                    {inputEmail.length > 0 && <span>{emailMessage}</span>}
                </p>
                <div className='email_auth'>
                    <input type='email' placeholder="이메일" value={inputEmail}  onChange={onChangeEmail} onBlur={onBlurEmailCheck}/>
                    <button type='button' onClick={onClickAuth} disabled={!clickAuth}>인증번호 받기</button>
                </div>
                <div className='email_auth'>
                    <input type='text'placeholder="인증번호 확인" value = {inputAuth} onChange={onChangeAuth} disabled={!clickAuth}></input>
                    <button type='button' onClick={onCheckAuth} disabled={!clickAuth}>인증하기</button>
                </div>
            </div>
            <div className="session">
                <p>
                    전화번호*
                    {inputTel.length > 0 && <span>{telMessage}</span>}
                </p>
                <input type='tel' placeholder="휴대폰번호('-' 제외)" value={inputTel} onChange={onChangeTel} onBlur={onBlurTelCheck} onKeyDown={onKeyPressEnter}/>
            </div>
            <div className="session">
                <button onClick={onClickJoin} disabled={!(isId && isPw && isConPw && isName && isNickname &&isEmail && isTel && isAuth)}>가입하기</button>
            </div>
        </ContainerJoin>
    );
};

export default Join;