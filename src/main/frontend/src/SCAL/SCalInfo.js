import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import styled from "styled-components";
import Api from "../api/plannetApi";
import Nav from "../Utill/Nav";
import Modal from '../Utill/Modal';
import TopBar from "../Utill/TopBar";
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
    h2 {
      font-size: 28px;
      font-weight: 900;
      margin-top: 35px;
      margin-bottom: 10px;
      span {
        font-size: 20px;
        font-weight: 400;
      }
    }
     .scalCreate {
        padding: 10px 30px;
        .scalForm {
            padding-top: 10px;
            display:flex;
            justify-content:center;
            align-items: center;
            flex-direction: column;
            >div>p {
                align-items: flex-start;
                font-size: 18px;
                font-weight: 600;
                line-height: 18px;
                margin:8px 0 4px;
            }
            .friend, .title {
                padding: 5px 30px;
                width: 100%;
                max-width: 500px;
           }
            .title {
                margin-top: 0;
                input {
                    padding: 0 15px;
                    border-radius: 5px;
                    width: 100%;
                    max-width: 440px;
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
                    &:focus::placeholder {color: #888;}
                    &::placeholder {color: #bbb;}
                }
            }
            .friend {
                padding-bottom: 0px;
                .friend_search {
                    margin: 0;
                    width: 100%;
                    height: 31px;
                    border: 2px solid #ddd;
                    padding: 0 13px;
                    border-radius: 5px;
                    input {
                        width: 100%;
                        max-width: 410px;
                        height: 27px;
                        border: 0px;
                        outline: none;
                        margin: 0;
                    }
                }
            }
            .friend_list {
                p {font-size: 15px}
                .is_list {height: 500px;}
            }
            .scal_add, .scal_delete, .smem_quit {
                cursor: pointer;
                margin: 10px 10px 0;
                width: 130px;
                font-weight: 600;
                font-size: 16px;
                padding: 8px 35px;
                border-radius: 25px;
                background-color: #333;
                color: white;
                border: none;
                transition: all .1s ease-in;
                &:hover {background-color: #666;color: #888;}
            }
        }
    }
`;

const SCalSetting = () => {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");
    let params = useParams(); // url에서 scaldNo를 가져오기 위해 uesParams() 사용
    let getNum = params.no; // params는 객체이기 때문에 풀어줘서 다시 getNum에 대입해줌
    
    const [sideBar, setSideBar] = useState(false); // 미디어쿼리시 nav 사이드바
    const [title, setTitle] = useState(''); // 공유캘린더 이름
    const [searchKeyword, setSearchKeyword] = useState('');
    const [friendList, setFriendList] = useState();
    const [isAdd, setIsAdd] = useState(false);
    const [owner, setOwner] = useState(''); // 공유캘린더 오너

    const [comment, setCommnet] = useState("");
    const [modalHeader, setModalHeader] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [option, setOption] = useState("");
    const [scalNo, setScalNo] = useState("");

    useEffect(() => {
        const scalInfo = async() => {
            try{
                const response = await Api.scalInfo(getNum, getId);
                setTitle(response.data.scalName);
                setFriendList(response.data.scalMember);
                setOwner(response.data.scalOwner);
            } catch(e) {
                console.log(e)
            }
        }
        scalInfo();
    },[getId, getNum]);

    // 공유 캘린더 이름 입력
    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    //  친구 검색 입력
    const onChangeSearchKeyword = (e) => {
    setSearchKeyword(e.target.value);
    }
    let filterNames = "";
    // DB에서 친구 목록을 가져오기 전에 실행되지 않는 조건문
    if(friendList != null) {
        // 친구 닉네임 검색
        filterNames = friendList.filter((e) => {
            return e.nickname.toLowerCase().includes(searchKeyword); // input 검색어가 포함되어 있는 friendList배열의 객체 반환
        });
    }

    const onClickSCalInfoSave = async() => {
        await Api.scalInfoSave(getNum, title);
        navigate('/scal/home/' + getNum);
    }
    const onClickSCalDelete = () => {
        setScalNo(getNum);
        setCommnet("삭제하시겠습니까?");
        setModalHeader("공유캘린더 삭제");
        setModalOpen(true);
    }
    const onClickSCalQuit = async() => {
        setOption(getId);
        setScalNo(getNum);
        setCommnet("탈퇴하시겠습니까?");
        setModalHeader("공유캘린더 탈퇴");
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <Wrap>
            <Nav sideBar={sideBar} setSideBar={setSideBar}/>
            <div className={`back ${sideBar? 'back_side_open' : ''}`}/>
            <TopBar sideBar={sideBar} setSideBar={setSideBar}/>
            <Modal open={modalOpen} close={closeModal} header={modalHeader} option={option} calNo={getNum}><p dangerouslySetInnerHTML={{__html: comment}}></p></Modal>
            <Section id="scalInfo" className="section">
                <div className="scalCreate">
                    <h2>Info <span>| Share Calendar</span></h2>
                    <div className="scalForm">
                        <div className="title">
                            <p>Calendar Name</p>
                            <input onChange={onChangeTitle} value={title} placeholder="공유 캘린더 이름" />
                        </div>
                        <div className="friend">
                            {getId === owner ? <p>Add Member</p> : <p>Search Member</p>}
                            <div className="friend_search">
                            <input title="검색" placeholder="친구 닉네임을 검색해보세요" onChange={onChangeSearchKeyword} value={searchKeyword}  />
                            </div>
                            <div className="friend_list">
                                <FriendList setCommnet={setCommnet} setModalHeader={setModalHeader} setModalOpen={setModalOpen} friendList={filterNames} isAdd={isAdd} setOption={setOption} title={title} setCalNo={setScalNo}/>
                            </div>
                        </div>
                        <div className="button-area1">
                            <button className="btn scal_add" onClick={onClickSCalInfoSave}>SAVE</button>
                            {getId === owner ? <><button className='btn left-space scal_delete' onClick={() => onClickSCalDelete()}>DELETE</button></> 
                            : <><button className='btn left-space smem_quit' onClick={() => onClickSCalQuit()}>QUIT</button></> }
                        </div>
                    </div>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    )
}

export default SCalSetting;