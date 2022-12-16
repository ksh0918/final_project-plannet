import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Nav from '../Utill/Nav';
import Api from "../api/plannetApi";

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
    overflow-y: hidden;
    overflow-x: hidden;
    .message {
        width: 100%;
        padding-left: 30px;
        height: 550px;
        height: 100%;
        float: left;  
        padding: 10px 30px 10px 30px;
        h2{
          margin-top: 35px;
          font-size: 28px;
        }
        span {
            float: left;
            margin-top: 10px;
            margin-bottom: 15px;
        }
        .sendBtn{
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
        .deleteBtn{
            cursor: pointer;
            margin-right: 10px;
            font-weight: 600;
            float: right;
            font-size: 16px;
            padding: 8px 15px;
            border-radius: 25px;
            background-color: #333;
            color: white;
            border: none;
            transition: all .1s ease-in;
            &:hover{background-color: #666;
                color: #888;}
        }
    }
    table {
        border-collapse: collapse; 
        width:100%;
        background-color: #4555AE;
        border-bottom: solid 1px #4555AE;
        text-align: center;
        tr:nth-child(2n) td {background-color: #fbfbfb;}
        th { 
            padding: 10px; 
            color: white;}
        td{
            padding: 10px; 
            background-color: white; 
            border-left: solid 1px #bbb; 
            border-top: solid 1px #ddd;
            font-weight: 400;
        }
        td:first-child {
            border-left: none
        };
        td:nth-child(2) {
            width: 400px; 
            text-align: left; 
            padding-left: 20px;
        }  
        tr:hover td, tr:hover a{
            color: #4555AE; 
            background-color: #efefef; 
            cursor: pointer;
        } 
    }
    .util_box {
        .page_list {
            width: 500px; 
            float:left;
            li {
                list-style-type: none;
                display: inline; 
                padding: 0px 5px;
                span {
                    cursor: pointer;
                    width: 25px;
                    text-align: center;
                    line-height: 25px;
                    display: inline-block; 
                    text-decoration: none; 
                    color:#000;
                    border-radius: 5px;
                    -webkit-transition: background-color 0.3s;
                    transition: background-color 0.3s;
                    &:active {background-color: #4555AE; color: #fff;}
                    &:hover {color:#0d3c01; font-weight: bold;}
                    &[aria-current] {background-color: #4555AE; color:white;}
                    &[disabled] {cursor: default; pointer-events: none; background: #eee;}
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
`;

const Message = () => {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");
    const [mNotiCount,setmNotiCount] = useState("");
    const onClickToCreate = () => {
        const link = "/send"
        navigate(link);
    }
    const [messageList, setMessageList] = useState([]); // boardList 불러오기
    
    // 페이지네이션
    const limit = 12; // 페이지당 게시물 수 (현재는 12개 고정)
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const offset = (page - 1) * limit; // 게시물 위치 계산, 시작점과 끝점을 구하는 offset
    const numPages = Math.ceil(messageList.length / limit); // 필요한 페이지 개수
    const [currPage, setCurrPage] = useState(page)
    let firstNum = currPage - (currPage % 5) + 1;
    let lastNum = currPage - (currPage % 5) + 5;
    
    const postsData = (posts) => {
        if(posts){
          let result = posts.slice(offset, offset + limit);
          return result;
        }
      }
  

    // 검색
    const [searchKeyword, setSearchKeyword] = useState('');
    const onClickSearch = async () => {
        try {
            const response = await Api.searchList(searchKeyword);
            setMessageList(response.data);
        } catch (e) {
            console.log(e);
        }
    }
    const onChangeSearchKeyword = (e) => {
        setSearchKeyword(e.target.value);
    }
    // 엔터를 눌렀을 때도 검색 되게
    const onKeyPressSearch = async(e) => {
        if(e.key === 'Enter'){
            onClickSearch();
            setSearchKeyword(''); // 검색 후 검색창 빈칸으로 만들기
        }
    }
    useEffect(() => {
        const messageData = async () => {
            try{
                const result = await Api.messageList(getId);
                setMessageList(result.data);
                setmNotiCount(result.data.notiList.length);
                window.localStorage.setItem("messageNotiCount", mNotiCount);
            }catch(e){
                console.log(e);
            }
        }
        messageData();
    },[]);
    return (
        <Wrap>
            <Nav/>
            <Section>
                <div className="message">
                    <h2>Message</h2>
                    <p>
                        <span>Plannet 친구들과 소통해 보세요!</span>
                        <button onClick={onClickToCreate} className="sendBtn">쪽지쓰기</button>
                        <button className="deleteBtn">선택삭제</button>
                    </p>
                    <table>
                        <tr>
                            <th><input type="checkbox" id="checkall"/></th>
                            <th>State</th>
                            <th>Sender</th>
                            <th>Detail</th>
                            <th>Date</th>
                        </tr>
                        {messageList.slice(offset,offset+limit).map(({isRead,sendId,detail,sendDate,receiveId})=>(
                            <tr key={receiveId}>
                                <td><input type="checkbox" id="checkone"/></td>
                                <td>{isRead}</td>
                                <td>{sendId}</td>
                                <td>{detail}</td>
                                <td>{sendDate.substring(0, 10)}</td>
                            </tr>
                        ))}
                    </table>
                </div>
                <div className="util_box">
                    <ul className="page_list">
                        <li><span onClick = {()=> {setPage(page - 1); setCurrPage(page-2);}} disabled = {page === 1}>«</span></li>
                        <li><span onClick = {() => setPage(firstNum)} aria-current={page === firstNum ? "page" : null}>{firstNum}</span></li>
                        {/*Array(numPages) :  페이지 수만큼의 size를 가지고 있는 배열을 생성하고 
                        .fill() : undefine으로 모든 칸 할당
                        .map(arr, i) : arr은 현재값, i는 인덱스로 각 자리 인덱스에 해당하는 값 할당 
                        Array(numPages).fill()의 값을 map()을 통해 하나씩 불러와 i로 return*/}
                        {Array(4).fill().map((_, i) => {
                            if(i <= 2) {
                                return (<li><span key={i + 1} onClick={() => {setPage(firstNum + i + 1)}} aria-current={page === firstNum + i + 1 ? "page" : null}>{firstNum + i + 1}</span></li>)
                            } else if(i >= 3) {
                                return (<li><span key={i + 1} onClick={() => setPage(lastNum)} aria-current={page === lastNum ? "page" : null}>{lastNum}</span></li>)
                            }
                        })}
                        <li><span onClick = {()=> {setPage(page + 1); setCurrPage(page);}} disabled = {page === numPages}>»</span></li>
                    </ul> 
                    <div className="search">
                        <input name="product_search" title="검색" placeholder="검색어 입력" onChange={onChangeSearchKeyword} onKeyDown={onKeyPressSearch} value={searchKeyword}/>
                        <span onClick={onClickSearch}><i className="bi bi-search"></i></span>
                    </div> 
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    );
}

export default Message;