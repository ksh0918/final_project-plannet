import styled from 'styled-components';

const Noti = styled.div`
    li {
        padding: 10px 16px;
        overflow: hidden;
        border-bottom: 1px solid #f3f3f3;
        transition: all .2s ease-in;
        p:first-child{
            font-size: 12px;
            span{
                color: #ccc;
                font-weight: 300;
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
                div{
                    float: left;
                    width: calc(179px/2);
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
        if(e.desc === '공유캘린더 초대') {
            setOption(e.key+"#SCAL#"+status);
        } else {
            setOption(e.key+"#Friend#"+status);    
        }
        setCommnet(e.desc + "을 " + status + "합니다.");
        setModalHeader(e.desc);
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
                            <p>{e.desc}</p>
                        </div>
                        <div>                        
                            <div onClick={() => onClickNoti(e, "승락")}>승락</div>
                            <div onClick={() => onClickNoti(e, "거절")}>거절</div>
                        </div>
                    </li>
                );})}
            </ul>
            :
            <p className='nothing'><b>등록된 친구가 아직 없습니다.</b><br/>상단 오른쪽의 버튼을 눌러 친구를 추가해보세요!</p>}
        </Noti>
    );
}

export default FriendNoti;