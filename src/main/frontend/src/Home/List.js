import { useState, useEffect } from "react";
import styled from "styled-components";
import Api from "../api/plannetApi";

const ListBox = styled.div`
    width: 100%;
    div:first-child p {color: rgb(206, 36, 36);}
    div:last-child p {color: #3249ce;}
    div {
        display: block;
        width: calc((100% - 30px) / 7);
        height: 230px;
        background-color: #f8f8f8;
        border-radius: 5px;
        float: left;
        margin-right: 5px;
        padding: 5px;
        &>p {
            width: 100%;
            font-size: 15px;
            line-height: 26px;
            text-align: center;
            font-weight: 700;
            margin-bottom: 7px;
            border-bottom: 2px solid #eee;
        }
        ul {
            height: 180px;
            overflow: hidden;
            overflow-y: scroll;
            padding: 0;
            &:focus {outline: none;}
            &::-webkit-scrollbar {
                width: 5px;
                padding: 5px;
            }
            &::-webkit-scrollbar-thumb {
                height: 30%; /* 스크롤바의 길이 */
                background: #ddd; /* 스크롤바의 색상 */
                border-radius: 10px;
                border: 0px solid transparent;
                background-clip: padding-box;
            }
            &::-webkit-scrollbar-track {
                background: none;
                /*스크롤바 뒷 배경 색상*/
            }
            li {
                padding: 3px 8px;
                color: #4555ae;
                white-space:nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                list-style-type: disc;
                list-style-position: inside;
                span{
                    display: inline;
                    margin-left: -8px;
                }
                &.chkPlan{
                    text-decoration: line-through;
                    color: #bbb;
                    span{color: #bbb;}
                }
            }
            p.noPlan {
                color: #d9d9d9;
                text-align: center;
                line-height: 160px;
                margin-left: 8px;
            }
        }
        &:last-child {
            margin-right: 0;
        }
    }
`;

const List = ({props}) => {
    const weekDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; 
    return(
        <ListBox>
            {props && props.map((day, index) => {
                return(
                    <div>
                        <p>{weekDay[index]}</p>
                        <ul>
                            {day.length !== 0 ? 
                                day.map((plan) => {
                                    if((plan.checked) === 0) return (<li key={plan.no}><span>{plan.plan}</span></li>);
                                    else return (<li key={plan.no} className="chkPlan"><span>{plan.plan}</span></li>);
                                }) : <p className="noPlan">일정없음</p>
                            }
                        </ul>
                    </div>
                );
            })}
        </ListBox>
    );
}

export default List;