import styled from "styled-components";
import {ReactComponent as Logo} from "../Images/planet-001.svg";

const Bar = styled.div`
    display: none;
    width: 100vw;
    height: 65px;
    background-color: #e8f0fe;
    position: relative;
    i{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 25px;
        padding: 6px 10px;
        font-size: 36px;
        border-radius: 5px;
        transition: background-color 0.2s ease-in;
        &:hover{
            background-color: #d7e0f0;
        }
    }
    p{
        display: inline-block;
        span{
            position: absolute;
            top: 50%;
            transform: translateY(-48%);
            font-size: 28px;
            font-weight: bold;
            font-family: 'Comfortaa';
        }
        svg{
            margin: 3px 0 0 25px;
        }
    }
`;

const logoStyle = {
    fill: "linear-gradient(217deg, rgb(0, 82, 212, .8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgb(66, 99, 247, .8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgb(111, 177, 252, .8), rgba(0,0,255,0) 70.71%)"
};

const TopBar = ({sideBar, setSideBar}) => {
    const onClickSideBar = () => {
        sideBar? setSideBar(false) : setSideBar(true);
        console.log(sideBar);
    }
    return(
        <Bar id="topbar">
            <p><Logo style={logoStyle}/><span>Plannet</span></p>
            <i className="bi bi-list" onClick={onClickSideBar}/>
        </Bar>
    );
}
export default TopBar;