import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';
import Api from '../api/plannetApi'

const Comment = styled.div`
    padding: 0 !important;
    .comment_box {
        width: 100%;
        text-align: left;
        padding-top: 0;
        table {width: 100%;}
        table, tr, td {
            border-collapse: collapse;
            background: none;
            border-bottom: 1px solid #ddd;
        }
        tr:last-child {border-bottom: 2px solid #ddd;}
        tr td {
            padding: 8px 10px;
            word-break: break-all;
            &:first-child {width: 130px;}
            &:last-child {width: 140px; font-size: 12px;}
        }
        button {
            padding: 0px;
            .bi {font-size:12px; padding-left: 8px;}
        }
    }
    .button-area2 {
        text-align: right;
        .comment_btn {
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
            &:hover {background-color: #666; color: #888;}
        }
        .comment_text {
            position: relative;
            font-weight: 600;
            font-size: 16px;
            right: 10px;
            padding: 8px 35px;
            border-radius: 25px;
            background-color: #333;
            color: white;
            border: none;
            outline: none;
        }
    }
`;

const Comments = ({getNum, getId, setCommentsList, commentsList}) => {
    const navigate = useNavigate();

    // 링크에서 home인지 scal인지 구분  
    const currenLink = useLocation(); // 현재 링크 얻기
    const currentPath = currenLink.pathname.substring(0, 6); // Object 타입의 currentLink에서 pathname 정보 취득 + 일부 자리만 잘라 비교하기

    const [comments, setComment] = useState(''); 

    // 자유게시판 댓글 입력
    const onChangeComment = (e) => {
        setComment(e.target.value);
    }
    // 자유게시판 댓글 저장
    const onClickSaveComment = async() => {
        let commentsData = '';
        if (currentPath == "/board") {
            await Api.commentWrite(getNum, getId, comments);
            commentsData = await Api.commentsLoad(getNum);
        }
        else {
            console.log("저장의 false 들어옴");
            await Api.scalCommentWrite(getNum, getId, comments);
            commentsData = await Api.scalCommentsLoad(getNum);
        }
        setCommentsList(commentsData.data);
        setComment(''); // 등록 후 댓글창 빈칸으로 만들기
    } 
    // 자유게시판 댓글 삭제
    const onClickDeleteComment = async(commentNo) => {
        await Api.commentDelete(commentNo); 
        navigate(0);
    } 
    // 공유캘린더 댓글 저장
    const onClickSaveScalComment = async() => {
        await Api.commentWrite(getNum, getId, comments);
        const commentsData = await Api.commentsLoad(getNum);
        setCommentsList(commentsData.data);
        setComment(''); // 등록 후 댓글창 빈칸으로 만들기
    } 
    // 공유캘린더 댓글 삭제
    const onClickDeleteScalComment = async(commentNo) => {
        await Api.scalCommentDelete(commentNo); 
        navigate(0);
    } 

    if(currentPath == '/board') {
        return ( 
            <Comment>
                <div className="button-area2">
                    <input type='text' className='comment_text' placeholder='댓글 달기...' value={comments} onChange={onChangeComment} name='comments' size='58.5'></input>
                    <button className='comment_btn' onClick={onClickSaveComment}>REPLY</button>
                </div>
                <div className='comment_box'>
                    <table>
                        {commentsList.map(({no, commentNo, writerId, nickname, detail, date})=>(
                            <tr key={no}>
                                <td>{nickname}</td>
                                <td>{detail}</td>
                                {<td>{date}{getId === writerId ? <button><i class="bi bi-x-lg" onClick={()=> onClickDeleteComment(commentNo)}></i></button> : null}</td>}
                            </tr>
                        ))}
                    </table>
                </div>
            </Comment>    
        )
    } else {
        return ( 
            <Comment>
                <div className="button-area2">
                    <input type='text' className='comment_text' placeholder='댓글 달기...' value={comments} onChange={onChangeComment} name='comments' size='58.5'></input>
                    <button className='comment_btn' onClick={onClickSaveComment}>REPLY</button>
                </div>
                <div className='comment_box'>
                    <table>
                        {commentsList.map(({no, commentNo, writerId, nickname, detail, date})=>(
                            <tr key={no}>
                                <td>{nickname}</td>
                                <td>{detail}</td>
                                {<td>{date}{getId === writerId ? <button><i class="bi bi-x-lg" onClick={()=> onClickDeleteScalComment(commentNo)}></i></button> : null}</td>}
                            </tr>
                        ))}
                    </table>
                </div>
            </Comment>    
        )
    }
};

export default Comments;