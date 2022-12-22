import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Calendar from './Calendar';
import TopBar from '../Utill/TopBar';
import Nav from '../Utill/Nav';
import Memo from './Memo';
import List from './List';
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
    .etc {
        width: 30%;
        .moti{
            h2{margin-top: 20px;}
            p{
                width: 100%;
                height: 63px;
                padding: 10px;
                background-color: #f9f9f9;
                border-radius: 5px;
            }
        }
        .moti2{
            display: none;
            padding: 15px 15px;
            margin-top: 5px;
            border-radius: 5px;
            height: auto;
            position: relative;
            overflow: hidden;
            background-color: #f9f9f9;
            h2{display: none;}
            p{
                float: left;
                width: calc(100% - 56px);
                padding: 5px 20px;
                word-break: break-all;
                text-align: center;
                font-size: 15px;
            }
            i{
                float: left;
                width: 28px;
                display: block;
                font-size: 28px;
                text-align: center;
            }
        }
        textarea {
            width: 100%;
            height: 320px;
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
`;

const Home = () => {
    const getId = window.localStorage.getItem("userId");
    const [personalData, setPersonalData] = useState([]);
    const [doMark, setDoMark] = useState([]);
    const [endMark, setEndMark] = useState([]);
    const [sideBar, setSideBar] = useState(false);

    useEffect(() => {
        const personalHome = async() => {
            try{
                const response = await Api.personalHome(getId);
                setPersonalData(response.data)
                setDoMark(response.data.planMark[0]);
                setEndMark(response.data.planMark[1]);
            } catch(e){
            console.log(e);
            }
        }
        personalHome();
    },[getId]);

    return (
        <Wrap>
            <Nav sideBar={sideBar} setSideBar={setSideBar}/>
            <div className={`back ${sideBar? 'back_side_open':''}`}/>
            <TopBar sideBar={sideBar} setSideBar={setSideBar}/>
            <Section id="home" className="section">
                <div className="plan">
                    <h2>Plan it</h2>
                    <Calendar doMark={doMark} endMark={endMark}/>
                </div>
                <div className='etc'>
                    <div className='moti2'>
                        <h2>Motivation</h2>
                        <i className="fa-solid fa-quote-left"></i>
                        <p>{personalData.quote}</p>
                        <i className="fa-solid fa-quote-right"></i>
                    </div>
                    <div className='memo'>
                        <h2>Memo</h2>
                        <Memo props={personalData.memo}/>
                    </div>
                    <div className='moti'>
                        <h2>Motivation</h2>
                        <p>{personalData.quote}</p>
                    </div>
                </div>
                <div className="list">
                    <h2>List</h2>
                    <div className="history"></div>
                    <List props={personalData.list}/>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    );
}

export default Home;


