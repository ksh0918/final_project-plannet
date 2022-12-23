import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App';
import './Modal.css';
import Api from "../api/plannetApi";

const Modal = (props) => {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");
    const { open, close, header, boardNo, option, calNo, messageRead ,setMessageRead} = props;

    const onClickLogout = () => {
        window.localStorage.setItem("userId", "");
        window.localStorage.setItem("isLogin", "false");
        navigate('/');
    }
    const onClickWithdraw = async() => {
        await Api.memberDelete(getId);
        window.localStorage.setItem("userId", "");
        window.localStorage.setItem("isLogin", "false");
        navigate('/');
    }
    const onClickGoLogin = () => {
        navigate('/doLogin');
    }
    const onClickEdit = () => {
        const link = "/board/edit/" + boardNo;
        console.log(link);
        navigate(link);
    }
    const onClickDelete = async() => {
        await Api.boardDelete(boardNo);
        navigate('/board');
    }
    const onClickMessage = async() => {
        await Api.messageModalOpen(messageRead);
        setMessageRead("");
        navigate(0); 
        
    }
    const onClickUnfriend = async() => {
        await Api.unfriend(option);
        navigate(0);
    }
    const onClickNotiAnswer = async() => {
        console.log("option:" + option);
        if(option.indexOf(true) !== -1){
            const key = option.toString().slice(0, -4);
            const status = option.slice(-4);
            await Api.notiResponse(key, status);
        } else {
            const key = option.toString().slice(0, -5);
            const status = option.slice(-5);
            await Api.notiResponse(key, status);
        }
        navigate(0);
    }

    const onClickInviteSCAL = async() => { //수정해야함
        // await Api.unfriend(option); // 백엔드 구현해야함
        alert(option);
        navigate(0);
    }
    const onClickScalDelete = async() => {
        await Api.scalDelete(calNo);
        navigate('/home');
    }
    const onClickDrop = async() => {
        await Api.smemDelete(calNo, option);
        navigate(0);
    }
    const onClickInvite = async() => {
        console.log(calNo);
        console.log(option);
        await Api.smemInvite(calNo, option);
        navigate(0);
    }
    const onClickScalQuit = async() => {
        await Api.smemDelete(calNo, option);
        navigate(-1);
    }
    const onClickGoogleLogin = async() => {
        const response = await Api.changeSocialLogin(option);
        window.localStorage.setItem("userId", response.data.substring(7));
        window.localStorage.setItem("isLogin", "true");
        navigate('/home');
    }
    const onClickGoogleNo = async() => {
        navigate('/doLogin');
    }
    const onClickBackYes = async() => {
        // event.preventDefault();
        // navigate(-1);
    }
    
    return (
        <div className={open ? 'openModal modal' : 'modal'}>
            {open && 
                <section>
                    <header>
                        &nbsp;
                        {(header === '쪽지') ? '' : <button className='close' onClick={close}>&times;</button>}
                        
                    </header>
                    <main>{props.children}</main>
                    <footer>
                        {(header === '안내') ? <button className='yes btn-m' onClick={onClickLogout}>yes</button>: ''}
                        {(header === '탈퇴') ? <button className='yes btn-m' onClick={onClickWithdraw}>yes</button>: ''}
                        {(header === '로그인') ? <button className='yes btn-m' onClick={onClickGoLogin}>login</button>: ''}
                        {(header === '글수정삭제' && option === '수정') ? <button className='yes btn-m' onClick={onClickEdit}>yes</button>: ''}
                        {(header === '글수정삭제' && option === '삭제') ? <button className='yes btn-m' onClick={onClickDelete}>yes</button>: ''}
                        {(header === '쪽지') ? <button className='yes btn-m' onClick={onClickMessage}>yes</button>: ''}
                        
                        {(header === '친구삭제') ? <button className='yes btn-m' onClick={onClickUnfriend}>yes</button>: ''}
                        {(header === '알림반응') ? <button className='yes btn-m' onClick={onClickNotiAnswer}>yes</button>: ''}
                        {(header === '공유캘린더 초대') ? <button className='yes btn-m' onClick={onClickInviteSCAL}>yes</button>: ''}
                        {(header === '공유캘린더 삭제') ? <button className='yes btn-m' onClick={onClickScalDelete}>yes</button>: ''}
                        {(header === '멤버삭제') ? <button className='yes btn-m' onClick={onClickDrop}>yes</button>: ''}
                        {(header === '멤버초대') ? <button className='yes btn-m' onClick={onClickInvite}>yes</button>: ''}
                        {(header === '공유캘린더 탈퇴') ? <button className='yes btn-m' onClick={onClickScalQuit}>yes</button>: ''}

                        {(header === '구글 연동') ? <><button className='yes btn-m' onClick={onClickGoogleLogin}>yes</button><button className='close' onClick={onClickGoogleNo}>no</button></>: ''}
                        {(header === '구글 로그인 실패') ? <button className='close' onClick={onClickGoogleNo}>close</button>: ''}
                        {(header === '뒤로가기') ? <button className='yes btn-m' onClick={onClickBackYes}>yes</button> : ''}

                        {/* 헤더가 구글연동과 구글로그인 실패가 아니라면 close버튼이 뜨도록 */}
                        {(header === '구글 연동')||(header === '구글 로그인 실패') || (header === '쪽지') ? '' : <button className='close' onClick={close}>close</button>}
                    </footer>
                </section>
            }
        </div>
    );
};
export default Modal;