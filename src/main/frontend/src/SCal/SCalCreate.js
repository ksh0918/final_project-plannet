import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Api from "../api/plannetApi";
import Nav from "../Utill/Nav";

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
`;

const SCalCreate = () => {
    const userId = window.localStorage.getItem("userId");
    const [title, setTitle] = useState(''); // 공유캘린더 이름
    const [isAdd, setIsAdd] = useState(false); // 친구추가

    const onClickSave = async() => {
        await Api.boardCreate(userId, title);
        window.location.assign('/scal');
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    return (
        <Wrap>
            <Nav></Nav>
            <Section>
                <div className="scalCreate">
                    <h2>공유 캘린더</h2>
                    <div className="scal_form"></div>
                </div>
            </Section>
        </Wrap>
    )

}