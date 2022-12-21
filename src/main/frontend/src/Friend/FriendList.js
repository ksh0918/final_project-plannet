import styled from 'styled-components';
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Api from "../api/plannetApi";

const Friends = styled.div`
    overflow-y: scroll;
    width: 100%;
    height: calc(100% - 80px);
    border-radius: 5px;
    background-color: #f9f9f9;
    transition: all .5s ease-in;
    margin-top: 10px;
    text-align: center;
    &::-webkit-scrollbar {
        display: none;
    }
    p.nothing{
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        color: #d9d9d9;
        b{
            color: #d9d9d9;
            font-size: 17px;
        }
    }
    ul>p{
        margin-top: 10px;
        color: #bbb;
        font-size: 12px;
    }
    li{
        height: 70px;
        background-color: #f9f9f9;
        border-radius: 5px;
        padding: 10px 25px;
        position: relative;
        margin-bottom: 5px;
        transition: all .3s ease-in;
        &:hover {
            background-color: #f4f4f4;
            i {
                color: #888;
            }
            >div{
                border: 3px solid #a5c6ff;
            }
        }
        >div{
            transition: all .3s ease-in;
            width: 50px;
            height: 50px;
            position: absolute;
            overflow: hidden;
            border-radius: 50px;
            border: 3px solid #ebebeb;
            >img{
                width: 46px;
            }
        }
        p{
            text-align: left;
            position: absolute;
            left: 90px;
            top: 16px;
            width: calc(100% - 160px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span:first-child{
                font-size: 16px;
                font-weight: 700;
                margin-right: 5px;
                display: inline-block;
                max-width: calc(100% - 50px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: middle;
            }
            span:last-child{
                display: inline-block;
                vertical-align: middle;
                color: #bbb;
            }
            &:last-of-type{
            top: 38px;
            color: #888;
            }
        }
    }
    .unfriend_btn{
        transition: all .3s ease-in;
        cursor: pointer;
        position: absolute;
        font-size: 30px;
        color: #f9f9f9;
        right: 30px;
        top: 50%;
        transform:translateY(-50%);
    }
    .drop, .wait, .invite {
        transition: all .3s ease-in;
        cursor: pointer;
        position: absolute;
        font-size: 15px;
        color: black;
        background-color: red;
        right: 30px;
        top: 50%;
        transform:translateY(-50%);
    }
`;

const StyledInput = styled.input`
        transition: all .3s ease-in;
        cursor: pointer;
        position: absolute;
        font-size: 20px;
        color: #f9f9f9;
        right: 30px;
        top: 50%;
        transform:translateY(-50%);

    &:checked {
        border-color: transparent;
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-size: 150% 150%;
        background-position: 50%;
        background-repeat: no-repeat;
        background-color: #4555AE;
    }
`;

const FriendList = ({setCommnet,setModalHeader,setModalOpen,friendList,isAdd,setOption, isPage, title, setCalNo}) => {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId");
    let params = useParams(); // url에서 boardNo를 가져오기 위해 uesParams() 사용
    let getNum = params.no; // params는 객체이기 때문에 풀어줘서 다시 getNum에 대입해줌
    const [checkedButtons, setCheckedButtons] = useState([]); // 체크박스를 체크한 데이터를 넣을 빈배열

    // 친구삭제 버튼 팝업(수정해야함)
    const onClickUnfriend = (e) => {
        setOption(e);
        setCommnet("친구를 삭제하시겠습니까?</br>(삭제 시 상호 삭제됩니다)");
        setModalHeader("친구삭제");
        setModalOpen(true);
    }

   console.log("프렌드리스트 페이지 : ");
   console.log(friendList);
   
   // onChange함수를 사용하여 이벤트 감지, 필요한 값 받아오기 
   const changeHandler = (checked, e) => {
     // check가 되었을 경우 checkedButtons에 friendList의 객체를 추가
     if (checked) {
       setCheckedButtons([...checkedButtons, e]);
     } else { // check가 해제되었을 경우 checkedButtons 배열 형태에서 friendList의 객체를 삭제함
       setCheckedButtons(checkedButtons.filter(button => button !== e));
     }
   };

   console.log("체크버튼 : ");
   console.log(checkedButtons);
   
    const onClickSCalAdd = async() => {
        const response = await Api.scalCheck(getId); //2개이상의 scal에 참여중인지 확인 2개 이하면 true, 이상이면 false
        console.log(response.data);
        if(response.data) {
            const res = await Api.scalCreate(getId, title, checkedButtons); 
            const linkNo = res.data;
            navigate('/scal/home/' + linkNo);
        } else {
            setCommnet('최대 공유 캘린더 개수(2개)를 넘어 공유 캘린더를 생성할 수 없습니다.');
            setModalOpen(true);
        }
    }
    const onClickDrop = async(userCode) => {
        setOption(userCode);
        setCalNo(getNum);
        setCommnet("멤버로 삭제하시겠습니까?");
        setModalHeader("멤버삭제");
        setModalOpen(true);
    }
    const onClickWait = async() => {
        setCommnet("이미 초대한 친구입니다.");
        setModalHeader("멤버대기");
        setModalOpen(true);
    }
    const onClickInvite = async(userCode) => {
        setOption(userCode);
        setCalNo(getNum);
        setCommnet("멤버로 초대하시겠습니까?");
        setModalHeader("멤버초대");
        setModalOpen(true);
    }
   
    return (
        <>
        <Friends className={(friendList? 'is_list' : '') + ' ' + (isAdd? 'add_active_box' : '')}>
            {friendList?
            <ul>
                {friendList.map(e =>{return(
                    <li>
                        <div><img src={"https://plannetmanager5.s3.ap-northeast-2.amazonaws.com/" + e.proImg} alt="profileImg" /></div>
                        <p>
                            <span>{e.nickname}</span>
                            <span>&#35;{e.userCode}</span>
                        </p>
                        <p>{e.profile}</p>
                        {isPage === "친구삭제" && <i className="bi bi-x-lg unfriend_btn" onClick={() => onClickUnfriend(e.key)}></i>} 
                        {/* checked: 체크표시 & 해제를 시키는 로직. 배열에 e 데이터가 있으면 true, 없으면 false                     onChange: onChange이벤트가 발생하면 check여부와 e 데이터를 전달하여 배열에 friendList의 객체를 넣어준다. */}
                        {isPage === "공유캘린더" && <StyledInput class="form-check-input scalFriend_check" id="checkboxNoLabel" onChange={check => { changeHandler(check.currentTarget.checked, e);}} 
                            checked={checkedButtons.includes(e) ? true : false}  type="checkbox" aria-label="..." />} 
                        {e.status == 1 &&<button className='drop' onClick={() => onClickDrop(e.userCode)}>삭제</button>}
                        {e.status == 2 &&<button className='wait' onClick={() => onClickWait()}>대기</button>}
                        {e.status == 0 &&<button className='invite' onClick={() => onClickInvite(e.userCode)}>초대</button>}

                    </li>
                );})}
                {isPage === "친구삭제" && <p>더 많은 친구를 추가해보세요!</p>}
            </ul>
            :
            <p className='nothing'><b>등록된 친구가 아직 없습니다.</b><br/>상단 오른쪽의 버튼을 눌러 친구를 추가해보세요!</p>}
        </Friends>
        {isPage === "공유캘린더" && <div className="scal_add"><button onClick={onClickSCalAdd}>공유캘린더 생성하기</button></div>}
        </>
        
    );
}

export default FriendList;