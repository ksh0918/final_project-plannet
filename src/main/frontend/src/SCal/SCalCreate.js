import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    div {
        padding-top: 30px;
    }
    h2 {
      font-size: 28px;
      font-weight: 900;
      margin-top: 20px;
      margin-bottom: 10px;
    }
     .scalCreate {
        padding: 28px;
        .scal_form {
        display:flex;
        justify-content:center;
        align-items: center;
        flex-direction: column;
           p {
                font-size: 20px;
                font-weight: 600;
                line-height: 18px;
                margin-bottom: 10px;
            }
            .title {
                width: 410px;
                margin-top: 0;
                input {
                    padding: 0 15px;
                    border-radius: 5px;
                    width: 350px;
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
            }
            .friend{
                width: 410px;
                margin-top: 0;
                .search {
//                    float: right;
                    width: 500px; height: 35px; padding: 0 10px; border: solid 2px #ddd;
                    background-color: white;
                    input {width: 150px; height: 31px; border: 0px; outline: none; margin-right: 10px;}
                }
            }
        }
    }

`;

const SCalCreate = () => {
    const getId = window.localStorage.getItem("userId");
    const [title, setTitle] = useState(''); // 공유캘린더 이름
    const [friendList, setFriendList] = useState([
        {proImg: "https://images.unsplash.com/photo-1668603145974-c05f7a0e4552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80", nickname: "안녕하세요", userCode: "#0000", profile: "자기소개입니다"},
        {proImg: "https://images.unsplash.com/photo-1669847171248-8f12c8160d57?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80", nickname: "안녕하세요", userCode: "#0000", profile: "자기소개입니다"}]);
    const [isAdd, setIsAdd] = useState(false); // 친구추가
    const [searchKeyword, setSearchKeyword] = useState('');

    const onChangeSearchKeyword = (e) => {
        setSearchKeyword(e.target.value);
    }

    const onKeyPressSearch = async(e) => {
        if(e.key === 'Enter'){
            onClickSearch();
            setSearchKeyword(''); // 검색 후 검색창 빈칸으로 만들기
        }
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const onClickaddFriend = (e) => {
        if(isAdd) setIsAdd(false);
        else setIsAdd(true);
    }

    const onClickSearch = async () => {
        try {
            const response = await Api.searchList(searchKeyword);
            setFriendList(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    const onClickSave = async() => {
        const response = await Api.scalCreate(getId, title, friendList);
        const link = "/scal/" // + response.data를 바로 변수에 대입! 그래야 순서가 안 꼬임
        window.location.assign(link);
    }
    // 디비에 갖다와서 user가 공유 캘린더가 2개 있으면 화면에도 접근 못하게 처리

        // FriendList.js에서 있어야 할듯
        // useEffect(() => {
        //     const friendLoad = async() => {
        //         try{
        //             const response = await Api.friendLoad(getId);
        //         } catch(e) {
        //             console.log(e);
        //         }
        //     }
        //     friendLoad();
        // },[getId]);

    return (
        <Wrap>
            <Nav></Nav>
            <Section>
                <div className="scalCreate">
                    <h2>공유 캘린더</h2>
                    <div className="scal_form">
                        <div className="title">
                            <p>공유 캘린더 이름</p>
                            <input onChange={onChangeTitle} value={title} placeholder="공유 캘린더 이름" />
                        </div>
                        <div className="friend_search">
                            <p>친구 추가</p>
                            <input name="product_search" title="검색" placeholder="검색어 입력" onChange={onChangeSearchKeyword} onKeyDown={onKeyPressSearch} value={searchKeyword}/>
                            <a href="#" onClick={onClickSearch}><i className="bi bi-search"></i></a>
                        </div>
                    </div>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    )
}
export default SCalCreate;