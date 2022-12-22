import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Nav from "../Utill/Nav";
import Api from "../api/plannetApi";
import Modal from "../Utill/Modal";
import ProImg from "./ProImg";
import TopBar from '../Utill/TopBar';


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
        width: 100%;
        padding: 10px 30px;
    }
    h2 {
      font-size: 28px;
      font-weight: 900;
      margin-top: 35px;
      margin-bottom: 10px;
    }
    .btnbox {
        height: 90px;
        line-height: 70px;
        position: relative;
        height: 50px;
        button.save {
            font-weight: 600;
            display: block;
            position: absolute;
            top: 0;
            right: 30px;
            font-size: 16px;
            padding: 8px 35px;
            border-radius: 25px;
            background-color: #333;
            color: white;
            border: none;
            transition: all .1s ease-in;
            &:hover {
                background-color: #666;
            }
            &:disabled {
                background-color: #aaa;
                color: #eee;
                cursor: default;
            }
        }        
    }
    .setting {
        .userInfo {
            display:flex ;
            justify-content:center;
            align-items: center;
            flex-direction: column;
            .session {
                width: 410px;
                padding: 5px 30px;
                margin-top: 0;
                p {
                    font-size: 18px;
                    font-weight: 600; 
                    line-height: 18px;
                    margin-bottom: 4px;
                    span {
                        color: #666;
                        font-weight: 400;
                        float: right;
                        margin-left: 10px;
                        line-height: 20px;
                    }
                }
                input, textarea {
                    padding: 0 15px;
                    border-radius: 5px;
                    width: 350px;
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
                textarea {
                    padding: 10px 15px;
                    height: 100px;
                    resize: none;
                    overflow-y: scroll;
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
                }
            }
        }
    }
    .withdrawal {
        cursor: pointer;
        text-align: left;
        text-decoration: underline;
        color: #ccc;
    }
`;

const Setting = () => {
    const navigate = useNavigate();
    const userId = window.localStorage.getItem("userId");
    const [userImgName, setUserImgName] = useState("");
    const [userImgUrl, setUserImgUrl] = useState({backgroundImage: "url(https://khprojectplannet.s3.ap-northeast-2.amazonaws.com/" + userImgName + ")"});
    const [userNickname, setUserNickname] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userPro, setUserPro] = useState("");

    const [changeNickname, setChangeNickname] = useState(""); // 닉네임 변경값
    const [changePhone, setChangePhone] = useState("");
    
    const [nicknameMessage, setNicknameMessage] = useState(""); // 닉네임 중복 여부 span 메시지
    const [telMessage, setTelMessage] = useState("");

    const [isNickname, setIsNickname] = useState(true); // 닉네임 가능 여부
    const [isTel, setIsTel] = useState(true);

    useEffect(() => {
        const userInfoLoad = async() => {
            try{
                const response = await Api.userInfoLoad(userId);
                console.log(response.data);
                setChangeNickname(response.data[0]);
                setChangePhone(response.data[4]);

                setUserNickname(response.data[0]);
                setUserEmail(response.data[3]);
                setUserPhone(response.data[4]);
                setUserPro(response.data[2]);
                setUserImgName(response.data[5]);
                setUserImgUrl({backgroundImage: "url(https://khprojectplannet.s3.ap-northeast-2.amazonaws.com/" + response.data[5] + ")"});
            } catch(e){
                console.log(e);
            }
        }
        userInfoLoad();
    },[userId]);

    // 설정 저장
    const onClickSave = async() => {
        await Api.userInfoSave(userId, changeNickname, changePhone, userPro);
        navigate("/home");
    }
    // 닉네임변경
    const onChangeNickname = (e) => {
        setChangeNickname(e.target.value);
        setIsNickname(false);
    }
    const onChangePhone = (e) => {
        setChangePhone(e.target.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
        // 전화번호 하이픈 포함 길이 체크
        if(e.target.value.length === 0 || e.target.value.length < 12 || e.target.value.length > 13) setIsTel(false);
        else setIsTel(true);
    }
    const onChangePro = (e) => {
        setUserPro(e.target.value);
    }

    //회원탈퇴 팝업
    const [comment, setCommnet] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const closeModal = () => {
        setModalOpen(false);
    };
    const onClickWithdraw = () => {
        setModalOpen(true);
        setCommnet("탈퇴 하시겠습니까?");
    }

    // 전화번호/이메일 중복확인
    const onBlurTelCheck = async() => {
        const memberCheck = await Api.overlapCheck(changePhone, "TYPE_TEL");
        if (memberCheck.data && (changePhone.length === 12 || changePhone.length === 13) && changePhone.indexOf('-') === 3) { // 전화번호 길이 체크
            setTelMessage("사용가능한 전화번호입니다.");
            setIsTel(true);
        } else if(!memberCheck.data && userPhone === changePhone){
            setTelMessage("기존 전화번호입니다.");
            setIsTel(true);
        } else if(!memberCheck.data) {
            setTelMessage("중복된 전화번호입니다.");
            setIsTel(false);
        } else {
          setTelMessage("사용 불가능한 전화번호입니다.");
          setIsTel(false);
        }
    }
    // 닉네임 중복확인
    const onBlurNicknameCheck = async() => {
        const memberCheck = await Api.overlapCheck(changeNickname, "TYPE_NICKNAME");
        if (userNickname === changeNickname) {
            setNicknameMessage("기존 닉네임입니다.");
            setIsNickname(true);
        } else if(memberCheck.data && changeNickname.length > 0){
            setNicknameMessage("사용가능한 닉네임입니다.");
            setIsNickname(true);
        } else {
            setNicknameMessage("이미 사용하고 있는 닉네임입니다.");
            setIsNickname(false);
        } 
    }

    //미디어쿼리시 nav 사이드바
    const [sideBar, setSideBar] = useState(false);

    return (
        <Wrap>
            <Nav sideBar={sideBar} setSideBar={setSideBar}/>
            <div className={`back ${sideBar? 'back_side_open':''}`}/>
            <TopBar sideBar={sideBar} setSideBar={setSideBar}/>
            <Section id="setting" className="section">
                <div className="setting">
                    <h2>Setting</h2>
                    <ProImg userId={userId} setUserImgName={setUserImgName} setUserImgUrl={setUserImgUrl} userImgUrl={userImgUrl}/>
                    <div className="userInfo">
                        <div className="session">
                            <p>닉네임 {changeNickname && <span>{nicknameMessage}</span>}</p>
                            <input onChange={onChangeNickname} value={changeNickname} onBlur={onBlurNicknameCheck} placeholder="닉네임"/>
                        </div>
                        <div className="session">
                            <p>이메일</p>
                            <input value={userEmail} placeholder="이메일" readOnly/>
                        </div>
                        <div className="session">
                            <p>전화번호 {changePhone && <span>{telMessage}</span>}</p>
                            <input onChange={onChangePhone} value={changePhone} onBlur={onBlurTelCheck} placeholder="전화번호"/>
                        </div>
                        <div className="session">
                            <p>자기소개글</p>
                            <textarea onChange={onChangePro} value={userPro} placeholder="자기소개글" maxlength="100" />
                        </div>
                        <span className="withdrawal" onClick={onClickWithdraw}>회원탈퇴</span>
                        <Modal open={modalOpen} close={closeModal} header="탈퇴">{comment}</Modal>
                    </div>
                </div>
                <div className="btnbox">
                    <button onClick={onClickSave} className="save" disabled={!(isTel && isNickname)}>SAVE</button>
                </div>
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    );
}

export default Setting;