import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ReactComponent as Logo } from "../Images/plannet-001.svg";
import styled from "styled-components"
import Api from "../api/plannetApi";
import Modal from "./Modal";

const Box = styled.div`
    width:280px;
    height: 100vh;
    background-color: #e8f0fe;
    float: left;
    text-align: center;        
    .logo {
        width: 100%;
        height: 140px;
        cursor: pointer;
        h1 {
            font-family: 'Comfortaa';
            font-size: 24px;
            line-height: 24px;
            letter-spacing: 2px;
        }
        h2 {
            font-family: 'Montserrat Alternates';
            font-size: 12px;
            line-height: 15px;
        }
    }
    .userinfo {
        padding-top: 30px;
        .userName {
            margin-top: 15px;
            font-size: 16px;
            font-weight: 800;
            padding: 3px;
        }
        .userId {
            font-weight: 300;
            font-size: 12px;
            i {
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
                &:first-child {margin-left: 4px;}
                &:hover {
                    background-color: #f0f0f0;
                    color: #888;
                    box-shadow: 1px 1px 3px #aaa;
                }
            }
        }
        .userPro {
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
        .userImgBox {
            height: 20vh;
            aspect-ratio: auto 1 / 1;
            border-radius: 100%;
            overflow: hidden;
            margin: 0 auto;
            background-size: cover;
        };
        .menu {
            display :table;
            height: 40px;
            margin: 0 auto;
            li {
                float: left;
                a, span {
                    padding: 0px 7px; 
                    line-height:50px; 
                    border-left: 1px solid #555; 
                    font-weight: 600; 
                    cursor: pointer;
                    &:hover {
                        color: #4555AE;
                    }
                }
                .notiCount {
                    line-height: 16.2px;
                    width: 20px;
                    height: 20px;
                    background-color: #4555AE;
                    z-index: 3;
                    padding: 2px 0;
                    position: absolute;
                    border: 1px solid balck;
                    border-radius: 10px 10px 10px 0px;
                    .notiCountText {
                        font-size: 10px;
                        color: #ddd;
                    }
                }
                &:first-of-type a {border-left: none;}
            }
        }
        .calList {
            clear: both;
            li {
                width: 90%;
                padding: 10px 8px;
                margin: 10px auto;
                background-color: #f5f6ff;
                border-radius: 5px;
                transition: all .3s ease-out;
                &:hover {
                    background-color: white;
                }
            }
            .calTitle {
                width: 90%;
                margin: 0 auto 6px;
                span:first-child {
                    display: inline-block;
                    width: 190px;
                    text-align: left;
                    font-weight: 600;
                }
                span:last-child {
                    display: inline-block;
                    width: 20px;
                    text-align: right;
                    i {color: #333;}
                }
            }
            .chartBackground {
                width: 90%;
                height: 5px;
                background-color: #e5e5e5;
                margin: 0 auto;
                border-radius: 15px;
                position: relative;
                .chartBar {
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
                z-index: 3;
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
    >i {
        position: absolute;
        left: -70px;
        font-size: 50px;
        padding: 5px;
        color: white;
        opacity: 1;
        cursor: pointer;
        transition: all 0.5s ease-in;
        visibility: visible;
    }
    .side_bar_open {
        opacity: 0;
        visibility: hidden;
    }
`;

const Nav = ({sideBar, setSideBar}) => {
    const navigate = useNavigate();
    const userId = window.localStorage.getItem("userId");

    const [userInfo, setUserInfo] = useState("");
    const [scalInfo, setScalInfo] = useState("");
    const [proHeight, setProHeight] = useState("");
    const [fNotiCount,setfNotiCount] = useState();
    const [mNotiCount,setmNotiCount] = useState();

    // 캘린더 클릭시 해당 캘린더로 이동
    const moveLink = async (calNo, userId) => {
        const link = "/scal/home/" + calNo;
        navigate(link);
    };

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
        navigate("/home");
    }

    //로고 색상
    const logoStyle = {
        fill: "linear-gradient(217deg, rgb(0, 82, 212, .8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgb(66, 99, 247, .8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgb(111, 177, 252, .8), rgba(0,0,255,0) 70.71%)"
    };

    const onClickCloseNav = () => {
        setSideBar(false);
    }

    useEffect(() => {
        const userInfoLoad = async() => {
            try{
                const response = await Api.userNavInfo(userId);
                setUserInfo(response.data.userInfo);
                setScalInfo(response.data.scalInfo);
                setProHeight(response.data.scalInfo.length * 47 + 390);
                const messageCnt = await Api.messageCntNoti(userId);
                if(messageCnt.data != null){setmNotiCount(messageCnt.data);}
                const friendData = await Api.friendLoad(userId);
                if(friendData.data != null){setfNotiCount(Object.keys(friendData.data.notiList).length);}
                else{console.log("null 값")}
            } catch(e) {
                console.log(e);
            }
        }
        userInfoLoad();
    }, [userId]);

    return (
        <Box id="nav" style={sideBar? {right: '0'} : {right: '-280px'}}>
            <i className={`bi bi-x-lg ${!sideBar? 'side_bar_open' : ''}`} onClick={onClickCloseNav}/>
            <div className="logo" onClick={onClickLogo}>
                <Logo style={logoStyle}/>
                <h1>plannet</h1>
                <h2>Let's plan it!</h2>
            </div>
            <div className="userinfo">
                <div className="userImgBox" style={{backgroundImage: "url('https://plannetmanager5.s3.ap-northeast-2.amazonaws.com/"+ userInfo[3] +"')"}}/>
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
                        {scalInfo && scalInfo.map(e => {
                            return (
                                <li onClick={()=> moveLink(e[0], userId)}>
                                    <p className="calTitle"><span>{e[1]}</span><span><i class="bi bi-caret-right-fill"></i></span></p>
                                    <div className="chartBackground">
                                        <div className="chartBar" style={{width: e[2]+'%'}}></div>
                                    </div>
                                </li>
                        )})}
                    </ul>
                </div>
                <ul className="menu">
                    <li><Link to="/board">자유게시판</Link></li>
                    <li><Link to="/friend">친구목록{fNotiCount >0 &&<span className="notiCount"><p className="notiCountText" >{fNotiCount>=100 ? "99+": fNotiCount}</p></span>}</Link></li>
                    <li><Link to="/message">쪽지{mNotiCount >0 &&<span className="notiCount"><p className="notiCountText" >{mNotiCount>=100 ? "99+": mNotiCount}</p></span>}</Link></li>
                    <Modal open={modalOpen} close={closeModal} header="안내">{comment}</Modal>
                </ul>
            </div>
        </Box>
    );
}

export default Nav;