import { Link } from "react-router-dom";
import styled from "styled-components"
import {ReactComponent as Logo} from "../Images/planet-001.svg";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import Api from "../api/plannetApi";


const Box = styled.div`
    width: 280px;
    height: 100vh;
    background-color: #e8f0fe;
    float: left;
    text-align: center;        
    .logo{
        width: 100%;
        height: 140px;
        cursor: pointer;
        h1{
            font-family: 'Comfortaa';
            font-size: 24px;
            line-height: 24px;
            letter-spacing: 2px;
        }
        h2{
            font-family: 'Montserrat Alternates';
            font-size: 12px;
            line-height: 15px;
        }
    }
    .userinfo{
        padding-top: 30px;
        .userName{
            margin-top: 15px;
            font-size: 16px;
            font-weight: 800;
            padding: 3px;
        }
        .userId{
            font-weight: 300;
            font-size: 12px;
            i{
                padding: 3px;
                display: inline-block;
                text-align: center;
                width: 17px;
                height: 17px;
                color: #888;
                font-size: 11px;
                background-color: white;
                border-radius: 50%;
                margin: 1px;
                cursor: pointer;
                &:first-child{margin-left: 4px;}
                &:hover{
                    background-color: #f0f0f0;
                    color: #888;
                    box-shadow: 1px 1px 3px #aaa;
                }
            }
        }
        .userPro{
            margin: 20px 0;
            padding-left:17px;
            white-space: pre;
            overflow-y: scroll;
            height: calc(80vh - 390px);
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
        }
        .userImgBox{
            height: 20vh;
            aspect-ratio: auto 1 / 1;
            border-radius: 100%;
            overflow: hidden;
            margin: 0 auto;
            background-size: cover;
        };
        .menu{
            width: 179.11px;
            height: 40px;
            margin: 0 auto;
            li{
                float: left;
                a, span{
                    padding: 0px 7px; 
                    line-height:40px; 
                    border-left: 1px solid #555; 
                    font-weight: 600; 
                    cursor: pointer;
                    &:hover{
                        color: #4555AE;
                    }
                }
            }
            li:first-child a{border-left: none;}
        }
        .calList{
            clear: both;
            li{
                width: 90%;
                padding: 10px 8px;
                margin: 10px auto;
                background-color: #f5f6ff;
                border-radius: 5px;
                transition: all .3s ease-out;
                &:hover{
                    background-color: white;
                }
            }
            .calTitle{
                width: 90%;
                margin: 0 auto 6px;
                span:first-child{
                    display: inline-block;
                    width: 190px;
                    text-align: left;
                    font-weight: 600;
                }
                span:last-child{
                    display: inline-block;
                    width: 20px;
                    text-align: right;
                    i{color: #333;}
                }
            }
            
            .chartBackground{
                width: 90%;
                height: 5px;
                background-color: #e5e5e5;
                margin: 0 auto;
                border-radius: 15px;
                position: relative;
                .chartBar{
                    height: 5px;
                    position: absolute;
                    left: 0;
                    background-color: #4555AE;
                    border-radius: 15px;
                    color: white;
                    text-align: right;
                    font-size: 10px;
                    padding-right: 10px;
                    line-height: 10px;
                    text-shadow: 1px 1px 1px #555;
                    overflow: hidden;
                }
            }
        }

        .tooltip {
            position: relative;
            .tooltiptext {
                visibility: hidden;
                background-color: white;
                color: #333;
                text-align: center;
                border-radius: 6px;
                padding: 2px 0;
                position: absolute;
                z-index: 1;
                font-size: 13px;
            }
            &:hover .tooltiptext {
                visibility: visible;
            }
            .tooltip-bottom {
                width: 60px;
                top: 130%;
                left: 50%;
                margin-left: -60px;
                box-shadow: 1px 1px 3px #ccc;
            }
        }
    }
`;

const Nav = () => {
    const userId = window.localStorage.getItem("userId");
    const [userInfo, setUserInfo] = useState("");
    const [scalInfo, setScalInfo] = useState("");
    const [proHeight, setProHeight] = useState("");
    
    useEffect(() => {
        const userInfoLoad = async() => {
            try{
                const response = await Api.userNavInfo(userId);
                setUserInfo(response.data.userInfo);
                setScalInfo(response.data.scalInfo);
                setProHeight(response.data.scalInfo.length * 47 + 390);
            } catch(e){
                console.log(e);
            }
        }
        userInfoLoad();
    },[userId]);

    // 로그아웃 팝업
    const [comment, setCommnet] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => {
        setModalOpen(false);
    };
    const onClickBtn = () => {
        setModalOpen(true);
        setCommnet("로그아웃 하시겠습니까?");
    }

    // 로고 클릭시 홈으로
    const onClickLogo = () => {
        window.location.assign("/home");
    }

    //유저정보가져오기
    const logoStyle = {
    fill:
  "linear-gradient(217deg, rgb(0, 82, 212, .8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgb(66, 99, 247, .8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgb(111, 177, 252, .8), rgba(0,0,255,0) 70.71%)"};

    return (
        <Box>
            <div className="logo" onClick={onClickLogo}>
                <Logo style={logoStyle}/>
                <h1>plannet</h1>
                <h2>Let's plan it!</h2>
            </div>
            <div className="userinfo">
                <div className="userImgBox" style={{backgroundImage: "url('https://khprojectplannet.s3.ap-northeast-2.amazonaws.com/"+ userInfo[3] +"')"}}/>
                <p className="userName">{userInfo[0]}</p>
                <p className="userId"># {userInfo[1]}<span className="tooltip"><Link to="/setting"><i className="bi bi-gear-fill"/><span class="tooltiptext tooltip-bottom">설정</span></Link></span><span className="tooltip"><i className="bi bi-box-arrow-right" onClick={onClickBtn}></i><span class="tooltiptext tooltip-bottom">로그아웃</span></span></p>
                <div className="userPro" style={{height: 'calc(80vh - ' + proHeight + 'px)'}}>{userInfo[2]}</div>
                <div className="calList">
                    <ul>
                        <Link to="/home">
                            <li>
                                <p className="calTitle"><span>{userInfo[0]}님의 플래너</span><span><i class="bi bi-caret-right-fill"></i></span></p>
                                <div className="chartBackground">
                                    <div className="chartBar" style={{width: userInfo[4]+'%'}}></div>
                                </div>
                            </li>
                        </Link>
                        {scalInfo&&scalInfo.map(e => {
                            return(
                            <Link to="/home">
                                {/* 추후 링크 변경 */}
                                <li>
                                    <p className="calTitle"><span>{e[1]}</span><span><i class="bi bi-caret-right-fill"></i></span></p>
                                    <div className="chartBackground">
                                        <div className="chartBar" style={{width: e[2]+'%'}}></div>
                                    </div>
                                </li>
                            </Link>
                        )})}
                        
                    </ul>
                </div>
                <ul className="menu">
                    <li><Link to="/board">자유게시판</Link></li>
                    <li><Link to="/friend">친구목록</Link></li>
                    <li><Link to="#">쪽지</Link></li>
                    <Modal open={modalOpen} close={closeModal} header="안내">{comment}</Modal>
                </ul>
            </div>
        </Box>
    );
}
export default Nav;