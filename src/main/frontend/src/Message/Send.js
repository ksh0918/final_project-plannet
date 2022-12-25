import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from "styled-components";
import Api from "../api/plannetApi";
import Nav from "../Utill/Nav";
import Modal from '../Utill/Modal';
import TopBar from '../Utill/TopBar';
import FriendList from '../Friend/FriendList';

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
    >div {
        width: 100%;
        padding: 10px 30px;
    }
    .sub_box {
        h2 {
            font-size: 28px;
            margin-top: 35px;
            font-weight: 900;
        }
        span {
            float: left;
            margin-top: 5px;
            margin-bottom: 10px;
        }
        button {
            float:right;
            font-weight: 600;
            display: block;
            font-size: 16px;
            padding: 8px 35px;
            border-radius: 25px;
            background-color: #4555AE;
            color: white;
            border: none;
            &:hover {background-color: #666;}
        }
        .sender {
            font-size: 16px;
            font-weight: 600;
            float: left;
            .sender-input {
                width:100px;
                &:focus {border: none; background:none;}    
            }
        } 
    }
    .is_list {
        margin-bottom: 5px;
        ul{
            overflow-y: scroll;
            height: 90px;
            &::-webkit-scrollbar{display: none;}
        }
        li {
            width: calc(100% / 3) !important;
            float: left !important;
            height: 45px;
            margin: 0%;
            padding: 5px 10px;
            >div{
                width: 35px; 
                height: 35px; 
                >img{width: 29px;}
            }
            >p{
                width: calc(100% - 70px); 
                left: 55px; 
                top: 12px; 
                span:first{width:calc(100% - 45px);}
            }
        }
    }
    button {
        border: none;
        padding-right: 20px; 
        background: none;
        font-size: 16px; 
        color: #bbb;
        font-weight: 700;
        transition: all .1s ease-in;
        &:hover, &:hover i {color: #888;}
        i {
            font-size: 16px; 
            line-height: 48px; 
            color: #bbb;
            transition: all .1s ease-in;
        }
    }
    table {
        border-collapse: collapse; 
        width: 100%;
        background-color: #4555AE;
        border-bottom: solid 1px #4555AE;
        text-align: center;
        table-layout: fixed;
        tr:nth-child(2n) td {background-color: #f9f9f9;}
        th {padding: 10px; color: white;}
        td {
            padding: 0 10px; 
            background-color: white; 
            border-left: none; 
            border-top: solid 1px #ddd;
            p {
                width: 80px;
                text-align: center;
                line-height: 33px;
                border-right: 1px solid #bbb;
                padding-right: 10px;
            }
            input{
                width: calc(100% - 100px);
                height: 27px;
                border: 0px;
                outline: none;
                margin: 3px 0 3px 3px;
                padding-left: 10px;
                border-radius: 5px;
                background-color: #f9f9f9;
                &:focus{background-color: #f0f0f0;}
            }
        }
    }
    .copy {
        width: 850px;
        position: absolute;
        bottom: 0;
        text-align: center;
        color: #dfdfdf;
        line-height: 50px;
    }
    .util_box {
        .page_list {
            width: 500px; float:left;
            li {list-style-type: none; display: inline; padding: 0px 5px;
                a {
                    display: inline-block; text-decoration: none; padding: 5px 10px; color:#000;
                    border-radius: 5px;
                    -webkit-transition: background-color 0.3s;
                    transition: background-color 0.3s;
                    &:active {background-color: #4caf50; color: #fff;}
                    &:hover {color:#0d3c01; font-weight: bold;}
                    &:hover:not(.active) {background-color: #4555AE; color:white;}
                }
            } 
        }
        .search {
            float: right;
            width: 200px; height: 35px; padding: 0 10px; border: solid 2px #ddd; 
            background-color: white;
            input {width: 150px; height: 31px; border: 0px; outline: none; margin-right: 10px;}
        }
    }
    .form-wrapper {
        width: 100%;
        margin: 0 auto;
    }
    .title-input {
        font-size: 20px;
        width: 600px;
        height: 40px;
        outline: none;
        display: block;
        margin-bottom: 30px;
        padding-left: 15px;
        margin: 0 auto;
        border: none;
        background: none;
        &:focus {border: none; background:none;}
    }
    .text-area {
        width: 80%;
        min-height: 500px;
    }
    .button-area {
        text-align: right;
        button {
            display :inline-block;
            right: 30px;
            cursor: pointer;
            padding: 8px 35px;
            border-radius: 25px;
            border: none;
            color: white;
            background-color: #333;
            transition: all .1s ease-in;
            font-weight: 600;
            font-size: 16px;
            &:hover {background-color: #666; color: #888;}
        }
        button:nth-child(1) {margin-right: 10px;}
    }
    .ck.ck-editor__editable:not(.ck-editor__nested-editable) {height: 500px; }
    .ck-editor__main {padding: 0;}
    .listfriend {
        font-size: 16px;
        font-weight: 600;
        float: left;
    }
`;

const Send= () => {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");

    const [sideBar, setSideBar] = useState(false); //미디어쿼리시 nav 사이드바
    const [friendList, setFriendList] = useState();
    const [receiveId,setReceiveId] = useState("");
    const [detail, setDetail] = useState("");
    const [lengthCheck, setLengthCheck] = useState(false);
    const [isBlur,setIsBlur] = useState(false);

    const [comment, setComment] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => {
        setModalOpen(false);
    }

    const onClickSend = async() => {
        if (detail.length === 0 || receiveId.length === 0) {
            setComment("내용과 받을 사람을 입력해 주세요");
            setModalOpen(true); 
        } else {
            const result = await Api.messageSend(getId , receiveId, detail);
            if(result.data) {
                setModalOpen(true);
                setComment("쪽지 전송이 성공했습니다.");
            }
            else {
                setModalOpen(true);
                setComment("쪽지 전송이 실패했습니다.");
            }
            navigate('/message');
        }
    }

    const onChangeReceiveId = (e) => {
        setReceiveId(e.target.value);
    }

    const onBlurSend = () => {
        setIsBlur(true)
    }

    useEffect(() => {
        const friendPage = async() => {
            try {
                const response = await Api.friendLoad(getId); //친구랑 알림 목록 불러오기
                setFriendList(response.data.friendList);
            } catch(e) {
                console.log(e);
            }
        }
        friendPage();
    }, []);
    
    return (
        <Wrap>
            <Modal open={modalOpen} close={closeModal} header="글쓰기 안내">{comment}</Modal>
            <Nav sideBar={sideBar} setSideBar={setSideBar}/>
            <div className={`back ${sideBar? 'back_side_open':''}`}/>
            <TopBar sideBar={sideBar} setSideBar={setSideBar}/>
            <Section id="send" className="section">
                <div className="board_list sub_box">
                    <h2>Send Message</h2>
                    <p>
                        <span>작성 시 유의해 주세요! 비방, 광고, 불건전한 내용의 쪽지는 사전 동의 없이 경고를 받을 수 있습니다.
                        <br/>(친구 이외 Plannet 이용자와 소통이 가능합니다.) </span>
                    </p>    
                    <table>
                        <tr>
                            <th>쪽지 작성</th>
                        </tr>
                        <tr>
                            <td>
                                <p className='sender'>받는 사람</p>
                                <input title="검색" placeholder="받는 사람의 닉네임#유저코드를 작성하세요." onChange={onChangeReceiveId} value={receiveId} onClick={onBlurSend}/>
                            </td>
                        </tr>
                    </table>       
                </div>
                {isBlur && friendList &&
                    <div className='friend'>
                        <p className='listfriend'>Find Friend</p>
                        <span><FriendList friendList={friendList} setReceiveId={setReceiveId} isPage="message" className='friendList'/></span>
                    </div>
                }
                <div className='form-wrapper'>
                    <CKEditor editor={ClassicEditor} data={detail} onChange={(event, editor) => {
                        const data = editor.getData();
                        setDetail(data);}}/>
                </div>
                <div className="button-area">
                    <button onClick={onClickSend} disabled={lengthCheck}>SEND</button>
                    <Link to='/message'><button>CANCLE</button></Link>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    )
};

export default Send;