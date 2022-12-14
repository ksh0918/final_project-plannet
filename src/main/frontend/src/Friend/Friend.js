import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Nav from '../Utill/Nav';
import FriendList from './FriendList';
import FriendAdd from './FriendAdd';
import Api from "../api/plannetApi";
import Modal from '../Utill/Modal';
import FriendNoti from './FriendNoti';
import { useNavigate } from 'react-router-dom';

const Wrap = styled.div`
    width: 1130px;
    height: 100vh;
    background-color: white;
    margin: 0 auto;
`;
const Section = styled.div`
    width: 850px;
    height: calc(100vh - 40px);
    float: left;
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    .friend, .noti {
        height: 550px;
        height: 100%;
        float: left;  
        padding: 10px 30px 10px 0;
        h2{
          margin-top: 35px;
        }
    }
    .friend {
        width: 70%;
        padding-left: 30px;       
    }
    .noti {
        width: 30%;
        >div:first-of-type {
            width: 100%;
            height: calc(100% - 130px);
            background-color: #f9f9f9;
            border-radius: 5px;
            border: 2px solid #f9f9f9;
            overflow-y: scroll;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        >div:last-of-type {
            margin-top: 10px;
            height: 50px;
            border-radius: 25px;
            text-align: center;
            color: white;
            font-size: 18px;
            line-height: 50px;
            background-color: #333;
            transition: all .1s ease-in;
            cursor: pointer;
            i{
                color: white;
                font-size: 24px;
                vertical-align: middle;
                transition: all .1s ease-in;
            }
            &:hover{
                background-color: #666;
                color: #888;
            }
            &:hover i{
                color: #888;
            }
        }
    }
    h2 {
        font-size: 28px;
        font-weight: 900;
        margin-bottom: 10px;
        position: relative;
        i{
            position: absolute;
            right: 0;
            font-size: 25px;
            line-height: 34px;
            transition: color .3s ease-in;
            &:hover {
                color: #555;
            }
        }        
    }
    .add_active_logo{
        color: #888;
    }
    .is_list{
        background-color: white !important;
    }
    .add_active_box{
        height: calc(100% - 160px) !important;
    }
    .add_active_addbox{
        height: 80px !important;
    }
`;

const Friend = () => {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");
    const [friendList, setFriendList] = useState();
    const [notiList, setNotiList] = useState();
    const [isAdd, setIsAdd] = useState(false);
    const [option, setOption] = useState("");

    useEffect(() => {
        const friendPage = async() => {
            try{
                const response = await Api.friendPageLoad(getId); //친구랑 알림 목록 불러오기
                setFriendList(response.data.friendList);
                setNotiList(response.data.notiList);
                console.log(response.data.friendList);
                console.log(response.data.notiList);
            } catch(e){
            console.log(e);
            }
        }
        friendPage();
    },[getId]);

    
    const onClickaddFriend = (e) => {
        if(isAdd) setIsAdd(false);
        else setIsAdd(true);
    }

    const onClickAddSCal = () => {
        // const response = await Api.personalHome(getId); //2개이상의 scal에 참여중인지 확인 2개 이하면 true, 이상이면 false
        // if(response.data) {
        //     navigate("/scal/create");
        // }
    }

    const [comment, setCommnet] = useState("");
    const [modalHeader, setModalHeader] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    
    const closeModal = () => {
        setModalOpen(false);
    };
    

    return (
        <Wrap>
            <Modal open={modalOpen} close={closeModal} header={modalHeader} option={option}><p dangerouslySetInnerHTML={{__html: comment}}></p></Modal>
            <Nav/>
            <Section>
                <div className="friend">
                    <h2>Friend<i className={'bi bi-person-fill-add ' + (isAdd? 'add_active_logo' : '')} onClick={onClickaddFriend}></i></h2>
                    <FriendAdd setCommnet={setCommnet} setModalHeader={setModalHeader} setModalOpen={setModalOpen} isAdd={isAdd} getId={getId}/>
                    <FriendList setCommnet={setCommnet} setModalHeader={setModalHeader} setModalOpen={setModalOpen} friendList={friendList} isAdd={isAdd} setOption={setOption}/>
                </div>
                <div className='noti'>
                    <h2>Notification</h2>
                    <FriendNoti setCommnet={setCommnet} setModalHeader={setModalHeader} setModalOpen={setModalOpen} notiList={notiList} setOption={setOption}/>
                    <div onClick={onClickAddSCal}>공유캘린더 생성하기<i className="bi bi-chevron-compact-right"/></div>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    );
}

export default Friend;


