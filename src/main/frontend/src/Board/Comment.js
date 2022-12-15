import React, { useState, } from 'react';
import styled from 'styled-components';
import Api from '../api/plannetApi'
import { useNavigate  } from "react-router-dom";

const Comment = styled.div`
    padding: 0 !important;

    .comment_box {
        width: 100%;
        text-align: left;
        padding-top: 0;
        table{width: 100%;}
        table, tr, td{
            border-collapse: collapse;
            background: none;
            border-bottom: 1px solid #ddd;
        }
        tr:last-child{
            border-bottom: 2px solid #ddd;
        }
        tr td {
            padding: 8px 10px;
            word-break: break-all;
            &:first-child {
                width: 130px;
                
            }
            &:last-child {
                width: 140px;
                font-size: 12px;
            }
        }
        button {
            padding: 0px;
            .bi {
                font-size:12px; 
                padding-left: 8px;
            }
        }
    }
    .button-area2 {
        text-align: right;
        .comment_btn{
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
            &:hover{background-color: #666;
                color: #888;}
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
    const [comments, setComments] = useState(''); 

    // 댓글 입력
    const onChangeComments = (e) => {
        setComments(e.target.value);
    }
    // 댓글 저장
    const onClickSaveComments = async() => {
        await Api.commentsWrite(getNum, getId, comments);
        const response = await Api.commentsLoad(getNum);
        setCommentsList(response.data);
        setComments(''); // 등록 후 댓글창 빈칸으로 만들기
    } 
    // 댓글 삭제
    const onClickDeleteComment = async(commentNo) => {
        await Api.commentsDelete(commentNo); 
        navigate(0);
    } 

    return(
        <Comment>
            <div className="button-area2">
                <input type='text' className='comment_text' placeholder='댓글 달기...' value={comments} onChange={onChangeComments} name='comments' size='58.5'></input>
                <button className='comment_btn' onClick={onClickSaveComments}>REPLY</button>
            </div>
            <div className='comment_box'>
                <table>
                    {commentsList.map(({no, commentNo, writerId, nickname, detail, date})=>(
                        <tr key={no}>
                            <td>{nickname}</td>
                            <td>{detail}</td>
                            <td>{date}{getId === writerId ? <button><i class="bi bi-x-lg" onClick={()=> onClickDeleteComment(commentNo)}></i></button> : null}</td>
                        </tr>
                    ))}
                </table>
            </div>
        </Comment>
    )
};

export default Comments;