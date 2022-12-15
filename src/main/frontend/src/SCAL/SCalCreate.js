import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Api from "../api/plannetApi";
import Nav from "../Utill/Nav";
import FriendList from '../Friend/FriendList';
import Modal from '../Utill/Modal';

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
    h2 {
        font-size: 28px;
        font-weight: 900;
        margin-top: 48px;
        margin-bottom: 10px;
        margin-left: 30px;
        position: relative;
        }
    .scalForm {
        padding: 10px;
        p {
            font-size: 22px;
            font-weight: 600;
            line-height: 18px;
            margin-bottom: 4px;
        }
    .scalInfo, .friend {
        height: 550px;
        height: 100%;
        float: left;
        padding: 30px 30px 10px 0;
        h2{
          margin-top: 35px;
        }
    }
    .scalInfo {
        width: 60%;
        padding-left: 30px;
        input {
            padding: 0 15px;
            margin: 16px 0 20px 0;
            border-radius: 5px;
            width: 426px;
            height: 30px;
            color: #333;
            background: #e8f0fe;
            border: none;
            font-weight: 500;
            outline: none;
            &:focus {
                background-color: #b8b9f1;
                color: #222;
            }
            &:focus::placeholder {
                color: #888;
            }
            &::placeholder {
                color: #bbb;
            }
            &:read-only{
                background-color: #eee;
                color: #aaa;
            }
        }
        .member {
            margin: 20px 0;
            p {
                font-size: 15px;
            }
        }
    }
    .friend_back {
    background-color: #e8f0fe;
    height:700px;
    }
    .friend {
        width: 40%;

        .friend_search .friend_list{
            width: 100%;
        }
        .friend_search {
            background-color: white;
            margin-top: 19px;
            height: 30px;
            border: solid 2px #ddd;
            padding: 0;
            input {
                background-color: white;
                width: 274px;
                height: 24px;
                border: 0px;
                outline: none;
                margin: 0;
                padding: 0;
            }
        }
        .friend_list {
            margin-top : 0;
            p {
                font-size: 15px;
            }
        }
    }
}
`;

const SCalCreate = () => {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");
    const [title, setTitle] = useState(''); // 공유캘린더 이름
    const [searchKeyword, setSearchKeyword] = useState(''); // 친구 검색
    const [friendList, setFriendList] = useState([
        {proImg: "https://images.unsplash.com/photo-1668603145974-c05f7a0e4552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80", nickname: "안녕하세요", userCode: "#0000", profile: "자기소개입니다"},
        {proImg: "https://images.unsplash.com/photo-1669847171248-8f12c8160d57?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80", nickname: "안녕하세요", userCode: "#0000", profile: "자기소개입니다"}]);
    const [isAdd, setIsAdd] = useState(false); // 친구추가

    const [comment, setComment] = useState("");
    const [modalHeader, setModalHeader] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [option, setOption] = useState("");
    const add = "공유캘린더";
    const cancel = "친구삭제";

    // 공유 캘린더 이름 입력
   const onChangeTitle = (e) => {
            setTitle(e.target.value);
            console.log("타이틀 : " + title);
        }
    // 친구 검색 입력
    const onChangeSearchKeyword = (e) => {
        setSearchKeyword(e.target.value);
        console.log("서치키워드 : " + searchKeyword);
    }

    const onKeyPressSearch = async(e) => {
        if(e.key === 'Enter'){
            onClickSearch();
            setSearchKeyword(''); // 검색 후 검색창 빈칸으로 만들기
        }
    }

    useEffect(() => {
        const myFriend = async() => {
            try{
                const response = await Api.friendPageLoad(getId); //친구랑 알림 목록 불러오기
                setFriendList(response.data.friendList);
            } catch(e) {
                console.log(e);
            }

        }
    })


    const onClickSearch = async () => {
        try {
            const response = await Api.searchList(searchKeyword);
            setFriendList(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    const closeModal = () => {
        setModalOpen(false);
    };

    const onClickSave = async() => {
        await Api.scalCreate(getId, title, friendList);
        const link = "/scal/" // + CAL_NO 해야 되는데 새로 생성하는 페이지에서는 어떻게 줘야 할지 아직 모르겠음
        window.location.assign(link);
    }

    return (
        <Wrap>
            <Modal open={modalOpen} close={closeModal} header={modalHeader} option={option}><p dangerouslySetInnerHTML={{__html: comment}}></p></Modal>
            <Nav></Nav>
            <Section>
                <div className="scalCreate">
                    <h2>공유 캘린더</h2>
                    <div className="scalForm">
                        <div className="scalInfo">
                            <div className="title">
                                <p>Title</p>
                                <input onChange={onChangeTitle} value={title} placeholder="공유 캘린더 이름" />
                            </div>
                            <p>Member</p>
                            <div className="member">
                                <FriendList  setCommnet={setComment} setModalHeader={setModalHeader} setModalOpen={setModalOpen} friendList={friendList} isAdd={isAdd} setOption={setOption} isPage={cancel}/>
                            </div>
                        </div>
                        <div className="friend">
                            <p>Friend</p>
                            <div className="friend_back">
                                <div className="friend_search">
                                <input title="검색" placeholder="친구 검색" onChange={onChangeSearchKeyword} onKeyDown={onKeyPressSearch} value={searchKeyword}/>
                                <a href="#" onClick={onClickSearch}><i className="bi bi-search"></i></a>
                                </div>
                                <div className="friend_list">
                                    <FriendList setCommnet={setComment} setModalHeader={setModalHeader} setModalOpen={setModalOpen} friendList={friendList} isAdd={isAdd} setOption={setOption} isPage={add}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    )
}
export default SCalCreate;