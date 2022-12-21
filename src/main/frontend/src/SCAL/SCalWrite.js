import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import styled from "styled-components";
import Api from "../api/plannetApi";
import Nav from "../Utill/Nav";
import PlanList from "../Write/PlanList";
import Comments from '../Board/Comment';

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
    .btnbox {
        height: 90px;
        line-height: 70px;
        position: relative;
        i {
            font-size: 22px; 
            vertical-align: middle;
            transition: all .1s ease-in;
        }
        button.backbtn {
            font-weight: 300;
            font-size: 16px; 
            vertical-align: middle;
            background: none;
            border: none;
            transition: all .1s ease-in;
            cursor: pointer;
        }
        button.save {
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
    .savebox {height: 40px; padding: 0 30px;}
    .btnbox:first-of-type:hover i, .btnbox:first-of-type:hover button {color: #bbb;}
    .sub_box {
        h2 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 900;
        }
    }
    .write_box {
        padding: 20px;
        width: 100%;
        background-color: #f9f9f9;
        border-radius: 5px;
    }
    .plan_it {
        height: 370px;
        .write_box {height: 300px; padding-bottom: 0;}
        ul {height: 230px;
            overflow-y: scroll;
            &:focus {outline: none;}
            &::-webkit-scrollbar {width: 20px; padding: 15px;}
            &::-webkit-scrollbar-thumb {
                height: 30%; /* 스크롤바의 길이 */
                background: #ddd; /* 스크롤바의 색상 */
                border-radius: 10px;
                border: 7px solid transparent;
                background-clip: padding-box;
            }
            &::-webkit-scrollbar-track {background: none;} /*스크롤바 뒷 배경 색상*/
        }
        li {
            line-height: 33px; 
            margin-bottom: 5px; 
            border-bottom: 2px solid #f5f5f5;
            transition: all .1s ease-in;
            &:focus-within {border-bottom-color: #4555AE;}
            button {
                display: block;
                float: right;
                padding-right: 0;
                i {
                    font-size: 18px; 
                    line-height: 30px; 
                    color: #bbb;
                    transition: all .1s ease-in;
                }
                &:hover i {color: #4555AE;}
            }
            .plan_writer{
                display: inline;
                width: auto;
                font-size: 12px;
                color: #777;
                line-height: 19px;
                text-align: center;
                border-radius: 14.5px;
                float: right; 
                margin: 7px 10px 0 0;
                padding: 0;
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
            i {font-size: 16px; line-height: 48px; color: #bbb; transition: all .1s ease-in;}
        }
        input, span {vertical-align: middle;}
        input[type="text"], span {
            width: 400px;
            border: none;
            background: none;
            padding: 0px;
            overflow: hidden;
            line-height: 16px;
            display: inline-block;
            outline: none;
        }
    }
    .comment {height: 350px;
        >div>div{padding: 10px 0;}
        h2{margin: 0;}
    }
    hr {border: none; background: #ddd; height: 2px; }
    .defaultPlanColor {color:#333;}
    .firstPlanColor {color: #bbb;}
    .donePlan {color: #bbb; text-decoration: line-through;}
`;

const SCalWrite = () => {
    const navigate = useNavigate();
    const getId = window.localStorage.getItem("userId"); // localStorage 저장 정보
    const isPage = "공유";

    let params = useParams(); // url에서 calNo를 가져오기 위해 uesParams() 사용
    const getNum = params.no; // params는 객체이기 때문에 풀어줘서 다시 getNum에 대입해줌

    // 링크에서 date 추출
    const currentLink = useLocation(); // 현재 링크 얻기
    const getDate = currentLink.pathname.slice(-10); // currentLink.pathname에서 slice로 date 부분만 추출
    console.log(currentLink);
    console.log(getDate);

    const [planList, setPlanList] = useState([]);
    const [commentsList, setCommentsList] = useState([]);
 

    // 변경사항이 있는데 사이트 이동하려고 할 시 경고 창 등장    
    window.addEventListener('beforeunload', (event) => {
        event.preventDefault(); // 표준에 따라 기본 동작 방지
        event.returnValue = ''; // Chrome에서는 returnValue 설정이 필요함
    });

    const onClickAddList = () => {
        const nextPlanList = planList.concat({
            key: planList.length+1,
            checked: false,
            text: "일정을 입력해주세요.",
            deleted: false
        });
        setPlanList(nextPlanList);
    }
    const onClickSave = async() => {
        await Api.scalPlanSave(getId, getNum, getDate, planList);
        navigate("/scal/home/" + getNum);
    }

    useEffect(() => {
        const writeLoad = async() => {
            try{
                // 플랜 불러오기
                const plans = await Api.scalPlanLoad(getNum, getDate);
                setPlanList(plans.data);  

                // 댓글 불러오기
                const comments = await Api.scalCommentsLoad(getNum, getDate);
                setCommentsList(comments.data);
            } catch(e){
                console.log(e);
            }
        }
        writeLoad();
        console.log(planList);
    }, [getId]);

    console.log(planList)

    return (
        <Wrap>
            <Nav/>
            <Section>
                <div className="btnbox">
                    <Link to='/home'>
                        <button className="backbtn">
                            <i className="bi bi-chevron-compact-left"/>{getDate}
                        </button>
                    </Link>
                </div>
                <div className="plan_it sub_box">
                    <h2>Plan it</h2>
                    <div className="write_box">
                        <PlanList planList={planList} setPlanList={setPlanList} setPlanDate={getDate} isPage={isPage}/>
                        <hr/>
                        <button onClick={onClickAddList}>
                            <i className="bi bi-plus-lg"></i> 추가하기
                        </button>
                    </div>
                </div>
                <div className="btnbox savebox">
                    <button className="save" onClick={onClickSave}>SAVE</button>
                </div>
                <div className="comment sub_box">
                    <h2>Comment</h2>
                    <Comments getId={getId} getNum={getNum} getDate={getDate} setCommentsList={setCommentsList} commentsList={commentsList}/>
                </div>
                
            </Section>
            <div className="copy">&#169; Plannet.</div>
        </Wrap>
    );
}

export default SCalWrite;