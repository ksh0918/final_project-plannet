import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import styled from 'styled-components';import Api from '../api/plannetApi'
import Modal from '../Utill/Modal';
import Nav from '../Utill/Nav';
import TopBar from '../Utill/TopBar';
import Comment from './Comment';

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
    &::-webkit-scrollbar {width: 20px; padding: 15px;}
    &::-webkit-scrollbar-thumb {
        height: 30%; /* 스크롤바의 길이 */
        background: #ddd; /* 스크롤바의 색상 */
        border-radius: 10px;
        border: 7px solid transparent;
        background-clip: padding-box;
    }
    &::-webkit-scrollbar-track {background: none;} /*스크롤바 뒷 배경 색상*/
    div {width: 100%; padding: 10px 30px;}
    .sub_box {
        h2 {font-size: 28px; margin-top: 35px; font-weight: 900;}
        >p>span {float: left; margin-top: 10px; margin-bottom: 15px;}
    }
    button {
        border: none;
        padding-right: 20px; 
        background: none;
        color: #bbb;
        font-weight: 700;
        transition: all .1s ease-in;
        &:hover, &:hover i {color: #888;}
    }
    .postInfo {
        border-collapse: collapse; 
        width:100%;
        background-color: #4555AE;
        border-bottom: solid 1px #bbb;
        text-align: center;
        tr:first-child td {border-top: solid 1px #4555AE; background-color: #f9f9f9;}
        th {padding: 10px; color: white;}
        td {padding: 10px; background-color: white; border-left: solid 1px #bbb; border-top: solid 1px #ddd;}
        td:first-child {border-left: none; width: 70px;}
        td:nth-child(2) {width: 85px;}  
        td:nth-child(3) {
            width: 135px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }  
        td:nth-child(4) {width: 100px;} 
        td:last-child {width: 100px;}
        br{display: none;}
        .title-input {font-size:20px; font-weight: 500;}
        .bi {padding-right:5px;}
        .bi-heart-fill {margin-left:13px;}
    }
    .detail{
        width: 100%;
        min-height: 450px;
        padding: 30px;
        border-bottom: 1px solid #4555AE;
        table {width: 100%; margin: 10px 0;}
        table, tr, td {
            border-collapse: collapse;
            padding: 5px;
            border: 1px solid #ddd;
            background: none;
        }
    }
    .button-area1 {
        height: 55px;
        text-align: right;
        .btn {
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
            &:hover {background-color: #666;
                color: #888;}
        }
        .left-space {
            margin-left: 10px;
        }
        .bi {
            color: #FC5C7D;
            line-height: 35px;
            font-size: 20px;
        }
    }
    .util_box{
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
    h3 {
        font-size: 28px;
        font-weight: 900;
        width: 100%;
        padding: 10px 30px 0;
    }
`;

const PostView = () => {
    const getId = window.localStorage.getItem("userId"); // localStorage 저장 정보

    let params = useParams(); // url에서 boardNo를 가져오기 위해 uesParams() 사용
    let getNum = params.no; // params는 객체이기 때문에 풀어줘서 다시 getNum에 대입해줌
    
    const [sideBar, setSideBar] = useState(false); // 미디어쿼리시 nav 사이드바
    const [postViewData, setPostViewData] = useState(); // 해당 게시물 번호의 내용 로드 (좋아요 제외)
    const [likeCntData, setLikeCnt] = useState(); // 좋아요 수 로드
    const [likeCheckedData, setLikeChecked] = useState(false); // 내가 좋아요를 했는지 여부 로드
    
    // 게시물 삭제, 수정 팝업
    const [modalOpen, setModalOpen] = useState(false); // 모달에 띄워줄 메세지 문구
    const [modalOption, setModalOption] = useState('');
    const [comment, setComment] = useState(""); // 모달창 안내 문구

    const closeModal = () => {
        setModalOpen(false);
    };
    const onClickEdit = () => {
        setModalOpen(true);
        setModalOption('수정');
        setComment("수정하시겠습니까?");
    }
    const onClickDelete = () => {
        setModalOpen(true);
        setModalOption('삭제');
        setComment("삭제하시겠습니까?");
    }

    const [commentList, setCommentList] = useState([]); // 댓글

    // 좋아요를 누를 때마다 표면적으로 +1, -1 해주기 & 하트 모양 토글
    const onClickLike = async() => {
        const likeChecked = await Api.likeCheckedToggle(getNum, getId);
        setLikeChecked(likeChecked.data);
        if (likeCheckedData) setLikeCnt(likeCntData - 1);
        else (setLikeCnt(likeCntData + 1));
    }
    
    // 본문 불러오기
    useEffect(() => {
        const postViewLoad = async () => {
            try {
                // 게시물 내용 불러오기
                const postView = await Api.postView(getNum);
                setPostViewData(postView.data);

                // 좋아요 수 불러오기
                const likeCnt = await Api.likeCnt(getNum);
                setLikeCnt(likeCnt.data);

                // 좋아요 체크 여부 불러오기
                const likeChecked = await Api.likeChecked(getId, getNum);
                setLikeChecked(likeChecked.data);

                // 댓글 불러오기
                const response = await Api.commentLoad(getNum);
                setCommentList(response.data);
            } catch (e) {
                console.log(e);
            } 
        };
        postViewLoad();
    }, [getId, getNum]);


    return (
        <Wrap>
            <Nav sideBar={sideBar} setSideBar={setSideBar}/>
            <div className={`back ${sideBar? 'back_side_open':''}`}/>
            <TopBar sideBar={sideBar} setSideBar={setSideBar}/>
            <Section id="postView" className="section">
            <Modal open={modalOpen} close={closeModal} header="글수정삭제" boardNo={getNum} option={modalOption}>{comment}</Modal>
                {postViewData&&postViewData.map( e => (
                    <> 
                    <div className="board_list sub_box"> 
                        <h2>Free Board</h2>
                        <p><span>유저들이 작성한 글에 댓글과 좋아요를 남기며 소통해보세요! <br/>커뮤니티 규칙에 맞지 않는 글과 댓글은 무통보 삭제됩니다.</span></p>  
                        <table className='postInfo'>
                            <tr>
                                <td className="title-input" key={e.boardNo} colSpan={5}>{e.title}</td>
                            </tr>
                            <tr>
                                <td>{e.category}</td>
                                <td><span>No.</span>{e.boardNo}</td>
                                <td><span>Writer. </span>{e.nickname}</td>
                                <td><i class="bi bi-eye"></i>{e.views}<br/><i class="bi bi-heart-fill"></i>{likeCntData}</td>
                                <td>{e.writeDate}</td>
                            </tr>
                        </table>
                        <div className='detail' dangerouslySetInnerHTML={{__html: e.detail}}></div>
                    </div>
                    <div className="button-area1">
                        <button onClick={onClickLike}>{likeCheckedData === true ? <i className="bi bi-heart-fill"></i> : <i className="bi bi-heart"></i>}</button>
                        <Link to='/board'><button className='btn left-space'>BACK</button></Link>
                        {getId === e.writerId ? <><button className='btn left-space' onClick={onClickEdit}>EDIT</button><button className='btn left-space' onClick={onClickDelete}>DELETE</button></> : null}
                    </div>
                    </>))}
                    <h3>Comment</h3>
                    <Comment getId={getId} getNum={getNum} setCommentList={setCommentList} commentList={commentList} ></Comment>
                     
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    )
};

export default PostView;