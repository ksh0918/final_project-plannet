import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Calendar from '../Home/Calendar';
import Nav from '../Utill/Nav';
import Memo from '../Home/Memo';
import List from '../Home/List';
import SCalAdd from "./SCalAdd";
import Api from "../api/plannetApi";

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
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        width: 20px;
        padding: 15px;
    }
    &::-webkit-scrollbar-thumb {
        height: 30%; /* 스크롤바의 길이 */
        background: #ddd; /* 스크롤바의 색상 */
        border-radius: 10px;
        border: 7px solid transparent;
        background-clip: padding-box;
    }
    &::-webkit-scrollbar-track {
        background: none;
        /*스크롤바 뒷 배경 색상*/
    }
    .plan, .etc {
        height: 550px;
        float: left;  
        padding: 10px 30px 10px 0;
        h2{
          margin-top: 35px;
        }
    }
    .plan {
        width: 70%;
        padding-left: 30px;
          &>div{
            background-color: #f9f9f9;
            width: 100%;
            height: 450px;
            border-radius: 5px;
            overflow: hidden;
        }
    }
    p.nothing{
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        color: #d9d9d9;
        b{
            color: #d9d9d9;
            font-size: 17px;
        }
    }
    .etc {
        width: 30%;
        .m-list h2 {
            margin-top: 20px;
        }
        .m-list-detail {
            width: 100%;
            height: 400px;
            resize: none;
            outline: none;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
            border: 2px solid #f9f9f9;
            transition: all .1s ease-in;

        }
        textarea {
            width: 100%;
            height: 340px;
            resize: none;
            outline: none;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
            border: 2px solid #f9f9f9;
            transition: all .1s ease-in;
            &::-webkit-scrollbar {
            width: 12px;
            }
            &::-webkit-scrollbar-thumb {
                height: 30%; /* 스크롤바의 길이 */
                background: #ddd; /* 스크롤바의 색상 */
                border-radius: 3px;
                border: 3px solid transparent;
                background-clip: padding-box;
            }
            &::-webkit-scrollbar-track {
                background: none;
                /*스크롤바 뒷 배경 색상*/
            }
            &:focus{
                border: 2px solid #f0f0f0;
            }
        }
    }
    .list {
        width: 100%;
        height: 300px;
        padding: 20px 30px 10px;
        clear: both;
    }
    h2 {
        font-size: 28px;
        font-weight: 900;
        margin-bottom: 10px;
    }
    i {
        position: absolute;
        right: 30px;
        font-size: 25px;
        line-height: 34px;
        transition: color .3s ease-in;
    &:hover {
        color: #555;
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


const SCalHome = () => {
    const getId = window.localStorage.getItem("userId");
    const [friendData, setFriendData] = useState([]);
    const [friendDoMark, setFriendDoMark] = useState([]);
    const [friendEndMark, setFriendEndMark] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    useEffect(() => {
        const scalHome = async() => {
            try{
                const response = await Api.scalHome(getId);
                setFriendData(response.data)
                setFriendDoMark(response.data.friendPlanMark[0]);
                setFriendEndMark(response.data.friendPlanMark[1]);
            } catch(e){
            console.log(e);
            }
        }
        scalHome();
    },[getId]);
    
    const onClickaddFriend = (e) => {
        if(isAdd) setIsAdd(false);
        else setIsAdd(true);
    }

    const [comment, setComment] = useState("");
    const [modalHeader, setModalHeader] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Wrap>
            <Nav/>
            <Section>
                <div className="plan">
                    <h2>Share Calendar</h2>
                    <Calendar doMark={friendDoMark} endMark={friendEndMark}/>
                </div>
                <div className='etc'>
                    <div className='memo'>
                        <h2>Memo</h2>
                        <Memo props={friendData.memo}/>
                    </div>
                    <div className='m-list'>
                        <h2>Member List<i className={'bi bi-person-fill-add ' + (isAdd? 'add_active_logo' : '')} onClick={onClickaddFriend}></i></h2>
                        <SCalAdd setCommnet={setComment} setModalHeader={setModalHeader} setModalOpen={setModalOpen} isAdd={isAdd} getId={getId}/>
                        <div className='m-list-detail'>
                            <p className='nothing'><b>친구와 캘린더를 공유하세요!</b></p>
                        </div>
                    </div>
                </div>
                <div className="list">
                    <h2>List</h2>
                    <div className="history"></div>
                    <List props={friendData.list}/>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    );
}

export default SCalHome;


