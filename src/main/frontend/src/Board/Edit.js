import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Api from "../api/plannetApi";
import Nav from "../Utill/Nav";
import TopBar from '../Utill/TopBar';

const Wrap = styled.div`
    width: 1130px;
    height: 100vh;
    background-color: white;
    margin: 0 auto;
`;
const StyledInput = styled.input`
        appearance: none;
        border: 2px solid #bbb;
        border-radius: 0.2rem;
        width: 20px;
        height: 20px;
        margin-right: 8px;
        transition: all .03s ease-in;
        vertical-align: middle;

    &:checked {
        border-color: transparent;
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-size: 150% 150%;
        background-position: 50%;
        background-repeat: no-repeat;
        background-color: #4555AE;
    }
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
        width: 100%;
        padding: 10px 30px;
    }
    .sub_box {
        h2 {
            font-size: 28px;
            margin-top: 35px;
            font-weight: 900;
        }
        span {
            float: left;
            margin-top: 10px;
            margin-bottom: 15px;
        }
        button {
            float:right;
            font-weight: 600;
            display: block;
            font-size: 16px;
            padding: 8px 35px;
            border-radius: 25px;
            background-color: #4555AE;
            color: white;
            border: none;
            &:hover{background-color: #666;}
        }
    }
    button {
        border: none;
        padding-right: 20px; 
        background: none;
        font-size: 16px; 
        color: #bbb;
        font-weight: 700;
        transition: all .1s ease-in;
        &:hover, &:hover i {color: #888;}
        i {
            font-size: 16px; 
            line-height: 48px; 
            color: #bbb;
            transition: all .1s ease-in;
        }
    }
    table {
        border-collapse: collapse; 
        width: 100%;
        background-color: #4555AE;
        border-bottom: solid 1px #4555AE;
        text-align: center;
        tr:nth-child(2n) td {background-color: #f9f9f9;}
        th {padding: 10px; color: white;}
        td {padding: 10px; background-color: white; border-left: solid 1px #bbb; border-top: solid 1px #ddd;}
        td:first-child {border-left: none; width: 115px;
            select{
                text-align:center;
                background: none;
                border: none;
                outline: none;
                font-size: 16px;
                font-weight: 600;
            }
        }
        td:nth-child(3) {width: 100px; text-align: left; padding-left: 20px;}  
        tr:hover td, tr:hover a {color: #4555AE;}
    }
    .util_box {
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
    .form-wrapper {
        width: 100%;
        margin: 0 auto;
    }
    .title-input {
        font-size: 20px;
        width: 100%;
        height: 30px;
        outline: none;
        display: block;
        margin-bottom: 30px;
        padding-left: 15px;
        margin: 0 auto;
        border: none;
        background: none;
        &:focus {border: none; background:none;}
    }
    .text-area {
        width: 80%;
        min-height: 500px;
    }
    .button-area {
        text-align: right;
        button {
            display :inline-block;
            right: 30px;
            cursor: pointer;
            padding: 8px 35px;
            border-radius: 25px;
            border: none;
            color: white;
            background-color: #333;
            transition: all .1s ease-in;
            font-weight: 600;
            font-size: 16px;
            &:hover, &:disabled {
                background-color: #666;
                color: #888;
            }
        }
        button:nth-child(1) {
            margin-right: 10px;
        }
    }
    .ck.ck-editor__editable:not(.ck-editor__nested-editable) {
        height: 500px; 
    }
    .ck-editor__main {padding: 0;
        .table {width: 100%;}
        table, tr, td {
            border-collapse: collapse;
            padding: 5px;
            border: 1px solid #ddd;
            background: none;
        }
    }
`;

function Edit() {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");
    let params = useParams(); // url에서 boardNo를 가져오기 위해 uesParams() 사용
    let getNum = params.no; // params는 객체이기 때문에 풀어줘서 다시 getNum에 대입해줌

    const [boardLoad, setBoardLoad] = useState();
    const [title, setTitle] = useState();
    const [detail, setDetail] = useState();
    const [isChecked, setIsChecked] = useState(false);
    const [category, setCategory] = useState('');
    // 제목, 내용 null 방지
    const [comment, setComment] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        const boardData = async () => {
            try {
                const response = await Api.postView(getNum);
                // 다른 사용자의 게시물 Edit 페이지에 아예 주소접근으로도 못 하게 방지
                // DB에서 해당 게시물의 작성자 아이디를 가져옴
                let writerId = response.data[0].writerId;
                if(getId !== writerId) { 
                    alert("본인의 글만 수정할 수 있습니다.")
                    navigate('/home');
                    return; // Edit 페이지로 이동하지 않도록 Home 페이지로 이동하고 useEffect에서 return
                } 
                setBoardLoad(response.data);
                setTitle(response.data[0].title);
                setDetail(response.data[0].detail);
                setCategory(response.data[0].category);
            } catch (e) {
                console.log(e);
            }
        };
        boardData();
    }, [getId, getNum, navigate]);

    // 해당 게시물 번호에 해당하는 Edit 페이지로 이동
    const onClickEdit = async() => {
        if (detail.length === 0 || title.length === 0) {
            setComment("제목과 내용을 입력해 주세요");
            setModalOpen(true); 
        } else {
            await Api.boardEdit(getNum, category, title, detail);
            const link = "/board/post_view/" + getNum;
            navigate(link);
        }
    }

    // 취소 버튼 클릭 시 게시물 번호에 해당하는 postView 페이지로 이동
    const onClickCancle = () => {
        const link = "/board/post_view/" + getNum;
        navigate(link);
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleChecked = (e) => {
        setIsChecked(e.target.checked);
    };

    const onChangerCategory = (e) => {
        setCategory(e.target.value)
    }
      
    //미디어쿼리시 nav 사이드바
    const [sideBar, setSideBar] = useState(false);

    return (
        <Wrap>
            <Nav sideBar={sideBar} setSideBar={setSideBar}/>
            <div className={`back ${sideBar? 'back_side_open':''}`}/>
            <TopBar sideBar={sideBar} setSideBar={setSideBar}/>
            <Section id="edit" className="section">
            {boardLoad && boardLoad.map( e => (
                <>
                    <div className="board_list sub_box">
                        <h2>Free Board</h2>
                        <p>
                            <span>작성 시 유의해 주세요! 비방, 광고, 불건전한 내용의 글은 사전 동의 없이 삭제될 수 있습니다.</span>
                        </p>    
                        <table className="postInfo">
                            <tr>
                                <th colSpan={2}>게시물 수정</th>
                            </tr>
                            <tr>
                                <td>
                                    <select name="category" onChange={onChangerCategory} value={category}>
                                        <option value="" disabled>--글머리--</option>
                                        <option value="자유" >자유</option>
                                        <option value="친구">친구</option>
                                        <option value="스터디">스터디</option>
                                        <option value="정보">정보</option>
                                    </select>
                                </td>
                                <td><input className="title-input" type='text' placeholder='제목을 입력하세요.' defaultValue={title} value={title} onChange={onChangeTitle} name='title' maxLength={33}/></td>
                                <td><StyledInput type="checkbox" checked={e.isChecked} onChange={handleChecked}/>익명</td>
                            </tr>
                        </table>           
                    </div>
                    <div className='form-wrapper'>
                        <CKEditor editor={ClassicEditor} data={e.detail} onChange={(event, editor) => {
                        const data = editor.getData();
                        setDetail(data);
                    }}/>
                    </div>
                    <div className="button-area">
                        <button onClick={onClickEdit}>SAVE</button>
                        <button onClick={onClickCancle}>CANCLE</button>
                    </div>
                </>))}
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    )
    
};

export default Edit;