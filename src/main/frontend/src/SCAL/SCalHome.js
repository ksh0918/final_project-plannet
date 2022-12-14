import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styled from 'styled-components';
import Api from "../api/plannetApi";
import TopBar from '../Utill/TopBar';
import Nav from '../Utill/Nav';
import Calendar from '../Home/Calendar';
import Memo from '../Home/Memo';
import List from '../Home/List';
import { S3Outposts } from 'aws-sdk';

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
          &>div {
            background-color: #f9f9f9;
            width: 100%;
            height: 450px;
            border-radius: 5px;
            overflow: hidden;
        }
    }
    p.nothing {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        color: #d9d9d9;
        text-align: center;
    }
    .etc {
        width: 30%;
        .m-list h2 {margin-top: 20px;}
        .m-list-detail {
            width: 100%;
            height: 135px;
            resize: none;
            outline: none;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
            border: 2px solid #f9f9f9;
            transition: all .1s ease-in;
            overflow-y: scroll;
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
            ul {
                li {
                    list-style-type: disc;
                    margin-left: 24px;
                    line-height: 22px;
                    span:first-child {
                        display: inline-block;
                        max-width: calc(100% - 50px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        vertical-align: middle;
                    }
                    span:last-child {
                        color:#bbb; 
                        font-weight: 200;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    &::marker {
                        color: #aed0f5;
                    }
                    &.owner {
                        font-weight: 600;
                        &::marker {
                            color:#ffca3a;
                            font-size: 24px;
                            line-height: 12px;
                        }
                        span {font-weight: 300;}
                    }
                }
            }
        }
        textarea {
            width: 100%;
            height: 250px;
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
        position: relative;
    }
    i {
        position: absolute;
        right: 0;
        color: #ddd;
        font-size: 25px;
        line-height: 34px;
        transition: color .1s ease-in;
        cursor: pointer;
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
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");
    let params = useParams(); // url에서 calNo를 가져오기 위해 uesParams() 사용
    const getNum = params.no; // params는 객체이기 때문에 풀어줘서 다시 getNum에 대입해줌

    const [sideBar, setSideBar] = useState(false); // 미디어쿼리시 nav 사이드바
    const [scalData, setScalData] = useState([]);
    const [memberDoMark, setMemberDoMark] = useState([]);
    const [memberEndMark, setMemberEndMark] = useState([]);
    const [smemberList, setSmemberList] = useState([{}]);

    useEffect(() => {
        const scalHome = async() => {
            try {
                const response = await Api.sharingHome(getNum);
                // 다른 사용자의 게시물 공유캘린더 페이지에 아예 주소접근으로도 못 하게 방지
                // DB에서 가져온 memberList 정보에서 사용자의 id가 존재하지 않으면 접근불가
                const memberListData = response.data.smemberList;
                let isExistsChecked = false;
                memberListData.map(({id}) => {
                    if (id == getId) isExistsChecked = true;});
                if (isExistsChecked) {
                    setScalData(response.data);
                    setMemberDoMark(response.data.splanMark[0]);
                    setMemberEndMark(response.data.splanMark[1]);
                    setSmemberList(memberListData);
                } else {
                    alert("본인이 속한 캘린더만 접근할 수 있습니다.")
                    navigate("/home");
                }
            } catch(e){
                console.log(e);
            }
        }
        scalHome();
    }, [getNum]);

    const onClickSetting = () => {
        navigate("/scal/info/" + getNum);
    }
    return (
        <Wrap>
            <Nav sideBar={sideBar} setSideBar={setSideBar}/>
            <div className={`back ${sideBar ? 'back_side_open' : ''}`}/>
            <TopBar sideBar={sideBar} setSideBar={setSideBar}/>
            <Section id="scalHome" className="section">
                <div className="plan">
                    <h2>{scalData.scalName}<i className="bi bi-gear-fill" onClick={onClickSetting}/></h2>
                    <Calendar doMark={memberDoMark} endMark={memberEndMark}/>
                </div>
                <div className='etc'>
                    <div className='memo'>
                        <h2>Memo</h2>
                        <Memo props={scalData.smemo}/>
                    </div>
                    <div className='m-list'>
                        <h2>Member List</h2>
                        <div className='m-list-detail'>
                            {smemberList ? 
                                <ul>
                                    {/* memberList */}
                                    {smemberList.map((e) => {
                                        if(e.isOwner) return(<li style={{listStyleImage:'url(/crown.svg)'}} className="owner"><span>{e.nickname}</span> <span>#{e.userCode}</span></li>);
                                        else return(<li>{e.nickname} <span>#{e.userCode}</span></li>);
                                    })}
                                </ul> :
                                <p className='nothing'>친구와 캘린더를 공유하세요!</p>
                            }
                        </div>
                    </div>
                </div>
                <div className="list">
                    <h2>List</h2>
                    <div className="history"></div>
                    <List props={scalData.slist}/>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    );
}

export default SCalHome;