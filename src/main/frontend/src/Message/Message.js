import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Api from "../api/plannetApi";
import Modal from '../Utill/Modal';
import Nav from '../Utill/Nav';
import TopBar from "../Utill/TopBar";

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
        float: left;  
        padding: 10px 30px 10px 30px;
        h2 {
          margin-top: 35px;
          font-size: 28px;
          font-weight: 900;
        }
        span {
            float: left;
            margin-top: 10px;
            margin-bottom: 15px;
        }
        .readBtn, .sendBtn, .deleteBtn{
        cursor: pointer;
        float: right;
        font-weight: 600;
        font-size: 16px;
        padding: 8px 25px;
        border-radius: 25px;
        background-color: #333;
        color: white;
        border: none;
        transition: all .1s ease-in;
        margin-left: 5px;
        &:hover{background-color: #666; color: #888;}

        }
    }
    .message>table {
        border-collapse: collapse; 
        width:100%;
        background-color: #4555AE;
        border-bottom: solid 1px #4555AE;
        text-align: center;
        table-layout: fixed;
        tr:nth-child(2n) td {background-color: #fbfbfb;}
        th { 
            padding: 10px; 
            color: white;
            &:first-child {width:35px;}
            &:nth-child(2){width: 90px;}
            &:nth-child(3){width: 130px;}
            &:last-child {width: 140px;}
        }
        td {
            padding: 10px; 
            background-color: white; 
            border-left: solid 1px #bbb; 
            border-top: solid 1px #ddd;
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            table {
                line-height: 0;
                td, tr {display: none;}
                &::after {content: "???????????? ???????????????. ???????????? ??????????????????!";}
            }
            p {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            &:first-child {
                border-left: none;
                input {vertical-align: middle; margin-top: -2px;}
            }
        }
        td:nth-child(4) {
            text-align: left;
        }  
        tr:hover td, tr:hover a {
            color: #4555AE; 
            background-color: #efefef; 
            cursor: pointer;
        } 
    }
    .util_box {
        padding: 10px 30px;
        .page_list {
            width: 250px; 
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
            cursor: pointer;
            float: right;
            width: calc(100% - 250px);
            max-width: 200px;
            height: 29px; 
            padding: 0 10px; 
            border: solid 2px #ddd; 
            background-color: white;
            margin-top: -2px;
            border-radius: 5px; 
            input {width: calc(100% - 25px); height: 25px; border: 0px; outline: none; margin-right: 10px;}
        }
    }
`;
const Message = () => {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");

    const [sideBar, setSideBar] = useState(false); // ?????????????????? nav ????????????
    const [checkItems, setCheckItems] = useState([]);
    const [messageRead,setMessageRead] = useState();
    const [messageList, setMessageList] = useState([]); // messageList ????????????

    const [comment, setComment] = useState("");
    const [modalHeader, setModalHeader] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => {
        setModalOpen(false);
    };
    const onClickList = (e) => {
        setModalOpen(true);
        setModalHeader("??????");
        setMessageRead(e.messageNo);
        setComment(e.detail);
    }

    const onClickToCreate = () => {
        const link = "/send"
        navigate(link);
    }

    // ???????????? ?????? ??????
    const handleAllCheck = (checked) => {
        if(checked) {
        // ?????? ?????? ?????? ??? ???????????? ?????? ?????? ????????? ?????? ????????? checkItems ?????? ????????????
        const messageArray = [];
        messageList.forEach((e) => messageArray.push(e.messageNo));
        setCheckItems(messageArray);
        }
        else {
        // ?????? ?????? ?????? ??? checkItems ??? ??? ????????? ?????? ????????????
        setCheckItems([]);
        }
    }
     // ???????????? ?????? ??????
    const handleSingleCheck = (checked, messageNo) => {
        if (checked) {
            setCheckItems(prev => [...prev,messageNo]); // ????????? ?????? ????????? ????????? ??????
        } else {
            // ?????? ?????? ?????? ??? ????????? ???????????? ????????? ?????? (??????)
            setCheckItems(checkItems.filter((e) => e !== messageNo)); // ????????? ?????? ????????? ???????????? ??????
        }
    };

    // ??????????????????
    const limit = 12; // ???????????? ????????? ??? (????????? 12??? ??????)
    const [page, setPage] = useState(1); // ?????? ????????? ??????
    const offset = (page - 1) * limit; // ????????? ?????? ??????, ???????????? ????????? ????????? offset
    const numPages = Math.ceil(messageList.length / limit); // ????????? ????????? ??????
    const [currPage, setCurrPage] = useState(page)
    let firstNum = currPage - (currPage % 5) + 1
    let lastNum = currPage - (currPage % 5) + 5

    // ??????
    const [searchKeyword, setSearchKeyword] = useState('');
    const onClickSearch = async () => {
        try {
            const response = await Api.searchMessageList(getId, searchKeyword);
            // console.log(response.data)
            setMessageList(response.data);
        } catch (e) {
            console.log(e);
        }
    }
    const onChangeSearchKeyword = (e) => {
        setSearchKeyword(e.target.value);
    }
    // ????????? ????????? ?????? ?????? ??????
    const onKeyPressEnter = async(e) => {
        if(e.key === 'Enter'){
            onClickSearch();
            setSearchKeyword(''); // ?????? ??? ????????? ???????????? ?????????
        }
    }
    
    // ????????????
    const onClickDelete = async() => {
        const response = await Api.messageDelete(checkItems);
        if(response.data) {
            navigate(0);
        }
        else {
            console.log(response.data);
        }
    }

    // ??????/ ?????????
    const onClickRead = async() => {
        const response = await Api.messageRead(checkItems);
        if(response.data) {
            navigate(0);
        }
        else {
            console.log(response.data);
        }
    }

    useEffect(() => {
        const messageData = async () => {
            try {
                const response = await Api.messageList(getId);
                setMessageList(response.data);
            } catch(e) {
                console.log(e);
            }
        }
        messageData();
    },[getId]);

    return (
        <Wrap>
            <Modal open={modalOpen} close={closeModal} messageRead={messageRead} setMessageRead={setMessageRead} header={modalHeader}><p dangerouslySetInnerHTML={{__html: comment}}></p></Modal>
            <Nav sideBar={sideBar} setSideBar={setSideBar}/>
            <div className={`back ${sideBar ? 'back_side_open' : ''}`}/>
            <TopBar sideBar={sideBar} setSideBar={setSideBar}/>
            <Section id="message" className="section">
                <div className="message">
                    <h2>Message</h2>
                    <p>
                        <span>Plannet ???????????? ????????? ?????????!</span>
                        <div className="msg_btn">
                            <button onClick={onClickToCreate} className="readBtn">????????????</button>
                            <button onClick={onClickDelete} className="deleteBtn">????????????</button>
                            <button onClick={onClickRead} className="sendBtn">??????</button>
                        </div>
                    </p>
                    <table>
                        <tr>
                            <th><input type='checkbox' name="select_all"
                                onChange={(e)=> handleAllCheck(e.target.checked)}
                                checked={messageList.length === checkItems.length  && messageList.length !== 0 ? true : false}/>
                            </th> 
                            <th>State</th>
                            <th>Sender</th>
                            <th>Detail</th>
                            <th>SendDate</th>
                        </tr>
                        {messageList.slice(offset,offset+limit).map(message=>(
                            <tr key={message.receiveId}>
                                <td><input type="checkbox" name={`select-${message.messageNo}`}
                                    onChange={(e) => handleSingleCheck(e.target.checked, message.messageNo)}
                                    //  checkItems ??? ?????? ????????? messageNo ??? ????????? true, ????????? false
                                    checked={checkItems.includes(message.messageNo) ? true : false}
                                /></td> 
                                <td onClick={()=>onClickList(message)}>{message.isRead===0 ? "????????????" : "??????"}</td>
                                <td onClick={()=>onClickList(message)}>{message.sendId}</td>
                                <td>{<div className='detail'onClick={()=>onClickList(message)} dangerouslySetInnerHTML={{__html: message.detail}}></div>}</td>
                                <td onClick={()=>onClickList(message)}>{message.sendDate}</td>
                            </tr>
                        ))}
                    </table>
                </div>
                <div className="util_box">
                    <ul className="page_list">
                        <li><span onClick = {()=> {setPage(page - 1); setCurrPage(page-2);}} disabled = {page === 1}>??</span></li>
                        <li><span onClick = {() => setPage(firstNum)} aria-current={page === firstNum ? "page" : null}>{firstNum}</span></li>
                        {/*Array(numPages) :  ????????? ???????????? size??? ????????? ?????? ????????? ???????????? 
                        .fill() : undefine?????? ?????? ??? ??????
                        .map(arr, i) : arr??? ?????????, i??? ???????????? ??? ?????? ???????????? ???????????? ??? ?????? 
                        Array(numPages).fill()??? ?????? map()??? ?????? ????????? ????????? i??? return*/}
                        {Array(4).fill().map((_, i) => {
                            if(i <= 2) {
                                return (<li><span key={i + 1} onClick={() => {setPage(firstNum + i + 1)}} aria-current={page === firstNum + i + 1 ? "page" : null}>{firstNum + i + 1}</span></li>)
                            } else if(i >= 3) {
                                return (<li><span key={i + 1} onClick={() => setPage(lastNum)} aria-current={page === lastNum ? "page" : null}>{lastNum}</span></li>)
                            }
                        })}
                        <li><span onClick = {()=> {setPage(page + 1); setCurrPage(page);}} disabled = {page === numPages}>??</span></li>
                    </ul> 
                    <div className="search">
                        <input name="product_search" title="??????" placeholder="????????? ??????" onChange={onChangeSearchKeyword} onKeyDown={onKeyPressEnter} value={searchKeyword}/>
                        <span onClick={onClickSearch}><i className="bi bi-search"></i></span>
                    </div> 
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    );
}

export default Message;