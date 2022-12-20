import styled from 'styled-components';

const Noti = styled.div`
    p.nothing{
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        color: #d9d9d9;
    }
    ul{
        overflow-y: scroll;
        &::-webkit-scrollbar {
            display: none;
        }   
    }
    li {
        padding: 10px 16px;
        overflow: hidden;
        border-bottom: 1px solid #f3f3f3;
        transition: all .2s ease-in;
        p:first-child{
            font-size: 12px;
            span{
                font-size: 12px;
                color: #ccc;
                font-weight: 200;
            }
        }
        p:last-of-type{
            font-size: 15px;
            font-weight: 600;
            line-height: 24px;
        }
        >div{
            &:first-child{
                margin: 0;
            }
            &:last-child{
                width: 100%;
                div{

                    float: left;
                    width: calc(50% - 2px);
                    margin: 1px;
                    line-height: 25px;
                    border-radius: 5px;
                    text-align: center;
                    cursor: pointer;
                    background-color: rgba(255,255,255, .5);
                    transition: all .2s ease-in;
                    color: #aaa;
                    border: 1px solid #ccc;
                    &:hover{
                        color: #fff;
                        background-color: #4555ae;
                        border: 1px solid #4555ae;
                    }
                }
            }
        }
        &:hover{
            background-color: #f4f4f4;
        }
    }
`;

const FriendNoti = ({setCommnet, setModalHeader, setModalOpen, setOption, notiList}) => {
    const onClickNoti = (e, status) => {
        setOption("?key=" + e.key + "&status=" + status);
        setCommnet((e.type === 'F'? '친구 요청을 ' : '공유캘린더 초대를 ') + (status? '승락' : '거절') + '합니다.');
        setModalHeader("알림반응");
        setModalOpen(true);
    }
    return (
        <Noti>
            {notiList? 
            <ul>
                {notiList.map(e =>{return(
                    <li>
                        <div>
                            <p>{e.nickname}<span>#{e.userCode}</span>님의</p>
                            <p>{e.type === 'F'? '친구 요청' : '공유캘린더 초대'}</p>
                        </div>
                        <div>                        
                            <div onClick={() => onClickNoti(e, true)}>승락</div>
                            <div onClick={() => onClickNoti(e, false)}>거절</div>
                        </div>
                    </li>
                );})}
            </ul>
            :
            <p className='nothing'>알림 없음</p>}
        </Noti>
    );
}

export default FriendNoti;