import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Api from '../api/plannetApi'
import Nav from "../Utill/Nav";
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
        span {float: left; margin-top: 10px; margin-bottom: 15px;}
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
            &:hover{background-color: #666; color: #888;}
        }
    }
    table {
        border-collapse: collapse; 
        width:100%;
        background-color: #4555AE;
        border-bottom: solid 1px #4555AE;
        text-align: center;
        table-layout: fixed;
        th{padding: 10px; color: white; background-color: #4555AE;}
        tr{
            background-color: white;
            &:nth-child(2n) td, &:nth-child(2n){
                background-color: #fbfbfb;
            }
        }
        
        td {
            padding: 10px; 
            background-color: white; 
            border-left: solid 1px #bbb; 
            border-top: solid 1px #ddd; 
            font-weight: 400; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;
        }
        th:first-child, td:first-child {border-left: none; width: 80px;}
        td:nth-child(2) {text-align: left;} 
        th:nth-child(3), td:nth-child(3){width: 120px;}
        th:nth-child(4), td:nth-child(4){width: 90px;}
        th:last-child, td:last-child{width: 115px;}
        tr:hover, tr:hover td, tr:hover a {
            color: #4555AE; 
            background-color: #efefef; 
            cursor: pointer;
        }
        .bi-heart-fill {
            padding-right:5px; 
            color:#FC5C7D;
        }
        .top3_List td ,.top3_List{
            background-color: #f2f2ff !important; 
            font-weight: 600;
        }
        .top3_List:last-child td {
            border-bottom: 1px solid #23338a;
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
            width: 200px; height: 29px; 
            padding: 0 10px; 
            border: solid 2px #ddd; 
            background-color: white;
            margin-top: -2px;
            border-radius: 5px;
            input {width: 150px; height: 25px; border: 0px; outline: none; margin-right: 10px;}
        }
    }
`;

const Board = () => {
    const navigate = useNavigate(); // navigate를 사용하기 위해 선언
    const getId = window.localStorage.getItem("userId"); // localStorage에 현재 로그인한 userId 저장

    // 값 불러오기 & 값 
    const [boardList, setBoardList] = useState([]); // boardList 불러오기
    const [top3List, setTop3List] = useState([]); // boardList 불러오기
    const [boardNo, setBoardNo] = useState(); // 게시물 클릭 시 boardNo 재설정
    
    // 페이지네이션
    const limit = 12; // 페이지당 게시물 수 (현재는 12개 고정)
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const offset = (page - 1) * limit; // 게시물 위치 계산, 시작점과 끝점을 구하는 offset
    const numPages = Math.ceil(boardList.length / limit); // 필요한 페이지 개수
    const [currPage, setCurrPage] = useState(page)
    let firstNum = currPage - (currPage % 5) + 1
    let lastNum = currPage - (currPage % 5) + 5

    // 타이틀 클릭 시 작성자 id 와 다르면 조회수 +1
    const viewsUp = async (boardNo, writerId) => {
        if(writerId !== getId) {
            await Api.boardViewsUp(boardNo);
        }
        const link = "post_view/" + boardNo;
        navigate(link);
    };

    // 글쓰기 버튼 클릭시 글쓰기 페이지로 이동
    const onClickToCreate = () => {
        const link = "create/"
        navigate(link);
    }

    // 검색
    const [searchKeyword, setSearchKeyword] = useState('');
    const onClickSearch = async () => {
        try {
            const response = await Api.searchList(searchKeyword);
            setBoardList(response.data);
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

    // top3List & boardList 불러오기
    useEffect(() => {
        const boardData = async () => {
            try {
                const boardListData = await Api.boardList();
                setBoardList(boardListData.data);
            } catch (e) {
                console.log(e);
            }
        };
        const top3Data = async () => {
            try {
                const top3ListData = await Api.top3List();
                setTop3List(top3ListData.data);
            } catch (e) {
                console.log(e);
            }
        };
        top3Data();
        boardData();
    }, []);
    //미디어쿼리시 nav 사이드바
    const [sideBar, setSideBar] = useState(false);

    return (
        <Wrap>
            <Nav sideBar={sideBar} setSideBar={setSideBar}/>
            <div className={`back ${sideBar? 'back_side_open':''}`}/>
            <TopBar sideBar={sideBar} setSideBar={setSideBar}/>
            <Section id="board" className="section">
                <div className="board_list sub_box"> 
                    <h2>자유게시판</h2>
                    <p>
                        <span>전 세계의 Plannet 이용자들과 한 곳에서 소통해 보세요!</span>
                        <button onClick={onClickToCreate}>글쓰기</button>
                    </p>
                    <table>
                        <tr>
                            <th>No.</th>
                            <th>Title</th>
                            <th>Writer</th>
                            <th>Views</th>
                            <th>Date</th>
                        </tr>
                        {top3List.map(({boardNo, writerId, title, nickname, views, writeDate}) => (
                            <tr className="top3_List" key={boardNo}>
                                <td><i className="bi bi-heart-fill"/>{boardNo}</td>
                                <td onChange={setBoardNo} onClick={()=> viewsUp(boardNo, writerId)}>{title}</td>
                                <td>{nickname}</td>
                                <td>{views}</td>
                                <td>{writeDate.substring(0, 10)}</td>
                            </tr>     
                        ))}
                        {boardList.slice(offset, offset + limit).map(({boardNo, writerId, title, nickname, views, writeDate}) => (
                            <tr key={boardNo}>
                                <td>{boardNo}</td>
                                <td onChange={setBoardNo} onClick={()=> viewsUp(boardNo, writerId)}>{title}</td>
                                <td>{nickname}</td>
                                <td>{views}</td>
                                <td>{writeDate.substring(0, 10)}</td>
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
    )
};

export default Board;