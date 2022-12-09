import AWS from "aws-sdk"
import styled from "styled-components";
import Api from "../api/plannetApi";

const ProImg = ({userId, setUserImgName, setUserImgUrl, userImgUrl}) => {

    const UserImgBox = styled.div `
        width: 180px !important;
        height: 180px;
        aspect-ratio: auto 1 / 1;
        border-radius: 100%;
        overflow: hidden;;
        background-size: cover;
        margin: 0 auto;
        position: relative; 
        input {display:none;}
        div {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-radius: 100%;
            background-color: rgba(0, 0, 0, .15);
            cursor: pointer;
            text-align: center;
            i {
                font-size: 50px;
                line-height: 160px;
                color: rgba(255, 255, 255, .6);
            }
        }
    `;
    
    //이미지 저장
    const bucket = "khprojectplannet";

    AWS.config.update({
        region: "ap-northeast-2",
        credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "ap-northeast-2:b3a02944-c9e9-4639-8d1f-6a3b950cdd9d"
        }),
    })
    
    const handleFileInput = async(e) => {
    // input 태그를 통해 선택한 파일 객체
    const file = e.target.files[0];
    const fileName = userId + e.target.files[0].name;

    // S3 SDK에 내장된 업로드 함수
    const upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: bucket, // 업로드할 대상 버킷명
            Key: fileName, // 업로드할 파일명
            Body: file, // 업로드할 파일 객체
        },
    })

    const promise = upload.promise()
    // 이미지 업로드
    promise.then(
        function (data) {
            alert("이미지가 변경되었습니다.")
        },
        function (err) {
            return alert("오류가 발생했습니다: ", err.message)
        }
    )
    setUserImgName(fileName);

    //서버에 이미지 이름 저장
    await Api.userImgSave(userId, fileName);

    //적용한 이미지 미리보기
    const fileUrl = URL.createObjectURL(file);
    setUserImgUrl({backgroundImage: "url(" + fileUrl + ")"});
    }

    return(
        <UserImgBox style={userImgUrl}>
            <label>
                <input type="file" accept="image/*" onChange={handleFileInput}/>
                <div><i className="bi bi-pencil-fill"></i></div>
            </label>
        </UserImgBox>
    );
}
export default ProImg;