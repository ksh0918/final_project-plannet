import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
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
        .scalForm {
            display:flex;
            justify-content:center;
            align-items: center;
            flex-direction: column;
           p {
                align-items: flex-start;
                font-size: 20px;
                font-weight: 600;
                line-height: 18px;
                margin-bottom: 10px;
           }
            .title {
                padding: 10px 30px;
                width: 500px;
                margin-top: 0;
                input {
                    padding: 0 15px;
                    border-radius: 5px;
                    width: 440px;
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
                width: 500px;
                padding: 20px 30px;
                .friend_search{
                    margin: 0;
                    width: 444px;
                    height: 31px;
                    border: solid 2px #ddd;
                    padding: 0;
                    input {
                        width: 410px;
                        height: 25px;
                        border: 0px;
                        outline: none;
                        margin: 0;
                    }
                }
            }
            .friend_list {
                height: 500px;
                padding:0;
                p {
                    font-size: 15px;
                }
            }
            .scal_add {
                padding : 0;
                button {
                    cursor: pointer;
                    font-weight: 600;
                    float: right;
                    font-size: 16px;
                    padding: 8px 35px;
                    border-radius: 25px;
                    background-color: #333;
                    color: white;
                    border: none;
                    transition: all .1s ease-in;
                    &:hover{
                        background-color: #666;
                        color: #888;
                    }
                }
            }
        }
    }
`;

    const SCalCreate = () => {
    // const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");
    const [title, setTitle] = useState(''); // 공유캘린더 이름
     const [searchKeyword, setSearchKeyword] = useState('');
    const [friendList, setFriendList] = useState();
    const [isAdd, setIsAdd] = useState(false);

    const [comment, setCommnet] = useState("");
    const [modalHeader, setModalHeader] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [option, setOption] = useState("");

    // const [checkedButtons, setCheckedButtons] = useState([]); // 체크박스를 데이터를 넣을 빈배열
    const page = "공유캘린더";


    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        const myfriends = async() => {
            try{
            console.log(getId);
            const response = await Api.friendPageLoad(getId); //친구랑 알림 목록 불러오기
            setFriendList(response.data.friendList);
            } catch(e) {
            console.log(e);
            }
        }
         myfriends();

    },[getId]);

    // 공유 캘린더 이름 입력
    const onChangeTitle = (e) => {
        setTitle(e.target.value);
        console.log("타이틀 : " + title);
    }
    //  친구 검색 입력
     const onChangeSearchKeyword = (e) => {
     setSearchKeyword(e.target.value);
     console.log("서치키워드 : " + searchKeyword);
     console.log(searchKeyword);

     }

     let filterNames="";
     // DB에서 친구 목록을 가져오기 전에 실행되지 않는 조건문
     if(friendList != null) {
        // 친구 닉네임 검색
        filterNames = friendList.filter((e) => {
            return e.nickname.toLowerCase().includes(searchKeyword); // input 검색어가 포함되어 있는 friendList배열의 객체 반환
          });
     }


    // const onClickSCalAdd = async() => {
    //     const response = await Api.scalCreate(getId, title); // 변수 미정
    //     const link = "/scal/" // + response.data를 바로 변수에 대입! 그래야 순서가 안 꼬임
    //     window.location.assign(link);
    // }
    // // 디비에 갖다와서 suser가 공유 캘린더가 2개 있으면 화면에도 접근 못하게 처리

    return (
        <Wrap>
            <Modal open={modalOpen} close={closeModal} header={modalHeader} option={option}><p dangerouslySetInnerHTML={{__html: comment}}></p></Modal>
            <Nav></Nav>
            <Section>
                <div className="scalCreate">
                    <h2>공유 캘린더</h2>
                    <div className="scalForm">
                        <div className="title">
                            <p>공유 캘린더 이름</p>
                            <input onChange={onChangeTitle} value={title} placeholder="공유 캘린더 이름" />
                        </div>
                        <div className="friend">
                            <p>친구 추가</p>
                            <div className="friend_search">
                            <input title="검색" placeholder="친구 닉네임을 검색해보세요" onChange={onChangeSearchKeyword} value={searchKeyword}  />
                            {/* <span onClick={onClicks}><i className="bi bi-search"></i></span> */}
                            {/* onKeyDown={onKeyPressSearch} */}
                            </div>
                            <div className="friend_list">
                                <FriendList setCommnet={setCommnet} setModalHeader={setModalHeader} setModalOpen={setModalOpen} friendList={filterNames} isAdd={isAdd} setOption={setOption} isPage={page} title={title}/>
                            </div>
                        </div>
                        {/* <div className="scal_add">
                         <button onClick={() => onClickSCalAdd(e)}>공유캘린더 생성하기</button>
                        </div> */}
                    </div>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    )
}
export default SCalCreate;