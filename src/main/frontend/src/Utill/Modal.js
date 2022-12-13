import React from 'react';
import '../App';
import './Modal.css';
import Api from "../api/plannetApi";
import { useNavigate } from 'react-router-dom';


const Modal = (props) => {
    const navigate = useNavigate();
    const { open, close, header, boardNo, option} = props;
    
    const getId = window.localStorage.getItem("userId");

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
        const link = "/edit/" + boardNo;
        console.log(link);
        navigate(link);
    }
    const onClickDelete = async() => {
        await Api.boardDelete(boardNo);
        navigate('/board');
    }
    const onClickUnfriend = async() => { //수정해야함
        // await Api.unfriend(option); // 백엔드 구현해야함
        window.location.reload();
    }
    const onClickAddFriend = async() => { //수정해야함
        // await Api.unfriend(option); // 백엔드 구현해야함
        window.location.reload();
    }
    const onClickInviteSCAL = async() => { //수정해야함
        // await Api.unfriend(option); // 백엔드 구현해야함
        alert(option);
        window.location.reload();
    }

    const onClickGoogleLogin = async() => {
        const response = await Api.changeSocialLogin(option);
        window.localStorage.setItem("userId", response.data);
        window.localStorage.setItem("isLogin", "true");
        navigate('/home');
    }
    const onClickGoogleNo = async() => {
        navigate('/doLogin');
    }
    const onClickBackYes = async() => {
        navigate(-1);
    }
    const onClickBackNo = async() => {

    }
    return (
        <div className={open ? 'openModal modal' : 'modal'}>
            {open && 
                <section>
                    <header>
                        &nbsp;
                        <button className='close' onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main>{props.children}</main>
                    <footer>
                        {(header === '안내') ? <button className='yes btn-m' onClick={onClickLogout}>yes</button>: ''}
                        {(header === '탈퇴') ? <button className='yes btn-m' onClick={onClickWithdraw}>yes</button>: ''}
                        {(header === '로그인') ? <button className='yes btn-m' onClick={onClickGoLogin}>login</button>: ''}
                        {(header === '글수정삭제' && option === '수정') ? <button className='yes btn-m' onClick={onClickEdit}>yes</button>: ''}
                        {(header === '글수정삭제' && option === '삭제') ? <button className='yes btn-m' onClick={onClickDelete}>yes</button>: ''}
                        
                        {(header === '친구삭제') ? <button className='yes btn-m' onClick={onClickUnfriend}>yes</button>: ''}
                        {(header === '친구 요청') ? <button className='yes btn-m' onClick={onClickAddFriend}>yes</button>: ''}
                        {(header === '공유캘린더 초대') ? <button className='yes btn-m' onClick={onClickInviteSCAL}>yes</button>: ''}

                        {(header === '구글 연동') ? <><button className='yes btn-m' onClick={onClickGoogleLogin}>yes</button><button className='close' onClick={onClickGoogleNo}>no</button></>: ''}
                        {(header === '구글 로그인 실패') ? <button className='close' onClick={onClickGoogleNo}>close</button>: ''}
                        {(header === '뒤로가기') ? <button className='yes btn-m' onClick={onClickBackYes}>yes</button> : ''}

                        {/* 헤더가 구글연동과 구글로그인 실패가 아니라면 close버튼이 뜨도록 */}
                        {(header === '구글 연동')||(header === '구글 로그인 실패') ? '' : <button className='close' onClick={close}>close</button>}
                    </footer>
                </section>
            }
        </div>
    );
};
export default Modal;