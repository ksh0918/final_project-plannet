import { S3Outposts } from "aws-sdk";
import axios from "axios";
const HEADER = 'application/json';
//const PLANNET_DOMAIN = "http://plannet.shop/";
const PLANNET_DOMAIN = "http://localhost:8111/";

// 이 주석은 다 하시면 지우고 커밋해주세요~!
// 정리하면서 확인할 것
// post, get 방식
// post는 " " 같은 식으로 뒤에 적어야 하고
// get은 ` ` 같은 식으로 뒤에 적어야 함 
// 크게 컨트롤러 순서는 member >  email > userinfo > noti > message > home > scal > board 
// 컨트롤러 마다는 한 줄씩 띄어주세요
// refresh controller는 제외
// 각 컨트롤러 안에 있는 api는 컨트롤러 안에 있는 순서대로 정리해서 적기
// 띄어쓰기 & 단어 통일 및 순서가 잘 안 되어있는 경우가 많아서 컨트롤러랑 동일하게 맞춰주세요~!
// 각 기능에 대한 주석도 꼭 한 줄 달아두기
// 프론트랑 연결하는 부분의 api 명칭은 자유롭게 지정해도 되나 통일성있게 (바꾸는 게 낫지 않을까? 하는 거 있으시다면 말씀해주세요~! 컨트롤러도 비슷하게 같이 바꿀게요)

const plannetApi = {
    // MemberController
    // 로그인 기능
    memberLogin: async function(id, pw) {
        const loginObj = {
            id: id,
            pwd: pw
        };
        return await axios.post(PLANNET_DOMAIN + "member/login", loginObj, HEADER);
    },
    // 구글 연동 시 메일에서 아이디를 찾아옴
    socialLoginFindId: async function(email){
        return await axios.get(PLANNET_DOMAIN + `member/social_login_find_id?email=${email}`, HEADER);
    },
    // 첫 소셜로그인시 정보 저장하기 (처음 구글 로그인 한 사람 회원가입)
    memberNewSocialSave: async function(id, name, email, nickname, tel){
        const reg = {
            id : id,
            name : name,
            email : email,
            nickname : nickname,
            tel : tel,
        };
        return await axios.post(PLANNET_DOMAIN + "member/new_social_save", reg, HEADER);
    },
    // 회원 가입
    memberReg: async function(id, pwd, name, nickname, email, tel, join_date) {
        const memberObj = {
            id: id,
            pwd: pwd,
            name: name,
            nickname: nickname,
            email: email,
            tel: tel,
            join_date: join_date
        };
        return await axios.post(PLANNET_DOMAIN + "member/register", memberObj, HEADER);
    },
    // 아이디, 이메일, 전화번호, 닉네임 중복체크
    overlapCheck: async function(keyword, type) { 
        const regCheck = {
            keyword: keyword,
            type: type
        };
        return await axios.post(PLANNET_DOMAIN + "member/overlap_check", regCheck, HEADER);
    },
    // 회원 아이디, 비밀번호 찾기
    memberFind: async function(keyword, email, type){
        return await axios.get(PLANNET_DOMAIN + `member/find?keyword=${keyword}&email=${email}&type=${type}`, HEADER);
    },
    // 새 비밀번호 저장
    memberNewPwd: async function(id, pwd){
        const reg = {
            id : id,
            pwd : pwd
        };
        return await axios.post(PLANNET_DOMAIN + "member/new_pwd", reg, HEADER);
    },
    // 회원 탈퇴
    memberDelete: async function(id) {
        const memberObj = {
            id: id,
        };
        return await axios.post(PLANNET_DOMAIN + "member/delete", memberObj, HEADER);
    },
    // 일반로그인에서 > 소셜로그인으로 전환
    changeSocialLogin: async function(email){ 
        const reg = {
            email : email,
        };
        return await axios.post(PLANNET_DOMAIN + "member/change_social_login", reg, HEADER);
    },

    // EmailController
    // 이메일 인증
    emailAuthCheck : async function(email){
        const object = {
            email : email
        };
        return await axios.post(PLANNET_DOMAIN+"login/mailConfirm",object,HEADER);
    },

    // UserInfoController
    // userInfo 불러오기 - userinfoController-userinfoload
    userInfoLoad: async function(id){
        return await axios.get(PLANNET_DOMAIN + `user/info_load?id=${id}`, HEADER);
    },
    // userInfo 수정하기
    userInfoSave: async function(id, nickname, tel, profile) {
        const object = {
            id: id,
            nickname: nickname,
            tel: tel,
            profile: profile
        };
        return await axios.post(PLANNET_DOMAIN + "user/info_save", object, HEADER);
    },
    // 사용자 프로필 이미지명 저장
    userImgSave: async function(id, imgName) {
        const object = {
            id: id,
            imgName: imgName
        };
        return await axios.post(PLANNET_DOMAIN + "user/img_save", object, HEADER);
    },
    // NavInfo 불러오기 - userinfoController-NavInfo
    userNavInfo: async function(id){
        return await axios.get(PLANNET_DOMAIN + `user/nav_info?id=${id}`, HEADER);
    },

    //NotiController
    // 친구 불러오기
    friendLoad: async function(id) {
        return await axios.get(PLANNET_DOMAIN + `noti/friend_load?id=${id}`, HEADER);
    },
    // 친구 추가
    friendAdd: async function(id, keyword) {
        const object = {
            id: id,
            keyword: keyword
        };
        return await axios.post(PLANNET_DOMAIN + "noti/friend_add", object, HEADER);
    },
    // 친구 삭제
    unfriend: async function(option) {
        const object = {
            key: option
        };
        return await axios.post(PLANNET_DOMAIN + "noti/unfriend", object, HEADER);
    },
    // 알림 승락/거절
    notiResponse: async function(key, status) {
        const object = {
            key: key,
            status: status
        };
        return await axios.post(PLANNET_DOMAIN + "noti/noti_response", object, HEADER);
    },
    // 공유 캘린더 갯수 확인
    scalCntCheck: async function(id) {
        return await axios.get(PLANNET_DOMAIN + `noti/cnt_check?id=${id}`, HEADER);
    },

    // MessageController
    // 쪽지 갯수 불러오기 (말풍선)
    messageCntNoti : async function(id){
        return await axios.get(PLANNET_DOMAIN + `message/cntNoti?receiveId=${id}`, HEADER);
    },
    // 쪽지 리스트
    messageList: async function(id){
        return await axios.get(PLANNET_DOMAIN + `message/list?receiveId=${id}`, HEADER);
    },
    // 쪽지 보내기
    messageSend : async function(id,receiveId,detail){
        const object = {
            id : id,
            receiveId : receiveId,
            detail : detail,
        };
        return await axios.post(PLANNET_DOMAIN+"message/send", object, HEADER);
    },
    // 쪽지 삭제
    messageDelete: async function(obj){
        return await axios.post(PLANNET_DOMAIN+"message/delete", obj, HEADER);
    },
    // 쪽지 읽음 표시
    messageRead : async function(obj){
        return await axios.post(PLANNET_DOMAIN+"message/read",obj,HEADER);
    },
    // 쪽지를 읽을 때 모달을 띄워줌
    messageModalOpen : async function(messageNo){
        const object = {
            messageNo : messageNo
        }
        return await axios.post(PLANNET_DOMAIN + "message/readModal", object, HEADER);
    },
    // 쪽지 검색
    searchMessageList: async function(id,keyword){
        return await axios.get(PLANNET_DOMAIN + `message/search_messageList?keyword=${keyword}&receiveId=${id}`, HEADER);
    },

    // HomeController
    // 개인 home/달력/주간일정/메모/명언 출력
    personalHome: async function(id) {
        return await axios.get(PLANNET_DOMAIN + `home/personal?id=${id}`, HEADER);
    },
    // 회원 메모 저장
    memoSave: async function(id, detail) {
        const object = {
            id: id,
            detail: detail
        };
        return await axios.post(PLANNET_DOMAIN + "home/memo", object, HEADER);
    },
    

    // WriteController
    // 플랜리스트.다이어리 로드
    writeLoad: async function(id, date) {
        return await axios.get(PLANNET_DOMAIN + `write/load?id=${id}&date=${date}`, HEADER);
    },
    // 플랜리스트.다이어리 저장
    writeSave: async function(id, date, planList, diary) {
        const object = {
            id: id,
            date: date,
            plan: planList,
            diary: diary
        };
        return await axios.post(PLANNET_DOMAIN + "write/save", object, HEADER);
        },


    // ScalController
    // 공유 캘린더 생성
    scalCreate: async function(id, title, checkedButton) {
        const object = {
            id: id,
            title: title,
            checkedButton: checkedButton
        };
        return await axios.post(PLANNET_DOMAIN + "scal/create", object, HEADER);
    },
    // 공유 캘린더 삭제
    scalDelete: async function(scalNo) {
        const object = {
            scalNo: scalNo
        };
        return await axios.post(PLANNET_DOMAIN + "scal/delete", object, HEADER);
    },
    // 공유 캘린더 멤버 초대
    smemInvite: async function(scalNo, id) {
        const object = {
            scalNo: scalNo,
            id: id
        };
        return await axios.post(PLANNET_DOMAIN + "scal/member_invite", object, HEADER);
    },
    // 공유 캘린더 멤버 삭제
    smemDelete: async function(scalNo, id) {
        const object = {
            scalNo: scalNo,
            id: id
        };
        return await axios.post(PLANNET_DOMAIN + "scal/member_delete", object, HEADER);
    }, // 공유 캘린더 정보 저장
    scalInfoSave: async function(scalNo, scalName) {
        const object = {
            scalNo: scalNo,
            scalName: scalName
        };
        return await axios.post(PLANNET_DOMAIN + "scal/info_save", object, HEADER);
    },
    // 공유 캘린더 home/달력/주간일정/메모/명언 출력
    sharingHome: async function(scalNo) {
        return await axios.get(PLANNET_DOMAIN + `scal/sharing?scalNo=${scalNo}`, HEADER);
    },
    // 공유 캘린더 메모 저장
    scalMemoSave: async function(scalNo, detail) {
        const object = {
            scalNo: scalNo,
            detail: detail
        };
        return await axios.post(PLANNET_DOMAIN + "scal/memo", object, HEADER);
    },
    // 공유 캘린더 일정 불러오기
    splanLoad: async function(scalNo, planDate) {
        return await axios.get(PLANNET_DOMAIN + `scal/splan_load?scalNo=${scalNo}&planDate=${planDate}`, HEADER);
    },
    // 공유 캘린더 일정 작성하기
    splanSave: async function(scalNo, id, date, planList) {
        const object = {
            scalNo: scalNo,
            id: id,
            date: date,
            planList: planList
        };
        return await axios.post(PLANNET_DOMAIN + "scal/splan_save", object, HEADER);
    },
    // 해당 캘린더에 작성된 댓글 불러오기
    scommentLoad: async function(scalNo, planDate) {
        return await axios.get(PLANNET_DOMAIN + `scal/scomment_load?scalNo=${scalNo}&planDate=${planDate}`, HEADER);
    },
    // 해당 캘린더에 댓글 작성
    scommentWrite: async function(scalNo, id, planDate, detail){
        const object = {
            scalNo: scalNo,
            id: id,
            planDate: planDate,
            detail
        };
        return await axios.post(PLANNET_DOMAIN + "scal/comment_save", object, HEADER);
    },
    // 해당 캘린더에 댓글 삭제
    scommnetDelete: async function(commentNo){
        const object = {
            commentNo: commentNo
        };
        return await axios.post(PLANNET_DOMAIN + "scal/comment_delete", object, HEADER);
    },
    // 공유 캘린더 정보 조회
    scalInfo: async function(scalNo, id) {
        return await axios.get(PLANNET_DOMAIN + `scal/info_load?scalNo=${scalNo}&id=${id}`, HEADER);
    },
    // 공유 캘린더 멤버 추가 요청
        scalAddMember: async function(id, keyword) {
        const object = {
            id: id,
            keyword: keyword
        };
        return await axios.post(PLANNET_DOMAIN + "scal/invite_member", object, HEADER);
    },

    // BoardController
    // 자유게시판 목록 출력
    boardList: async function(){
        return await axios.get(PLANNET_DOMAIN + "board/board_list", HEADER);
    },
    // 인기글 top3 목록 출력
    top3List: async function(){
        return await axios.get(PLANNET_DOMAIN + "board/top3_list", HEADER);
    },
    // 자유게시판 검색 목록 출력
    searchList: async function(keyword){
        return await axios.get(PLANNET_DOMAIN + `board/search_list?keyword=${keyword}`, HEADER);
    },
    // 특정 보드넘버의 게시물 내용 + 좋아요 수 불러오기
    postView: async function(boardNo){
        return await axios.get(PLANNET_DOMAIN + `board/post_view?boardNo=${boardNo}`, HEADER);
    },
    // boardNo의 게시물을 내가 작성하지 않았으면 조회수 +1
    boardViewUp:async function(boardNo){
        const object = {
            boardNo: boardNo
        }
        return await axios.post(PLANNET_DOMAIN+ "board/view_up", object, HEADER);
    },
    // 좋아요 수 불러오기
    likeCnt: async function(boardNo) {
        return await axios.get(PLANNET_DOMAIN + `board/like_cnt?boardNo=${boardNo}`, HEADER);
    },
    // 좋아요 여부 불러오기
    likeChecked: async function(id, boardNo) {
        return await axios.get(PLANNET_DOMAIN + `board/like_checked?id=${id}&boardNo=${boardNo}`, HEADER);
    },
    // 좋아요 버튼을 눌렀을 때 toggle 밑 데이터베이스 변경
    likeCheckedToggle: async function(boardNo, id) {
        const object = {
            boardNo : boardNo,
            id : id,
        }
        return await axios.post(PLANNET_DOMAIN + "board/like_checked_toggle", object, HEADER);
    },
    // 해당 게시물에 작성된 댓글 불러오기
    commentLoad: async function(boardNo, offsetNum, limitNum){
        return await axios.get(PLANNET_DOMAIN + `board/comment_load?boardNo=${boardNo}&offsetNum=${offsetNum}&limitNum=${limitNum}`, HEADER);
    },
    // 해당 게시물에 댓글 작성
    commentWrite: async function(boardNo, id, detail){
        const object = {
            boardNo : boardNo,
            id : id,
            detail : detail
        }
        return await axios.post(PLANNET_DOMAIN + "board/comment_write", object, HEADER);
    },
    // 해당 게시물에 댓글 삭제
    commentDelete: async function(commentNo){
        const object = {
            commentNo : commentNo
        }
        return await axios.post(PLANNET_DOMAIN + "board/comment_delete", object, HEADER);
    },
    // 자유게시판 글 작성
    boardWrite: async function(id, category, title, detail, isChecked){
        const object = {
            id : id,
            category: category,
            title : title,
            detail : detail,
            isChecked : isChecked
        };
        return await axios.post(PLANNET_DOMAIN + "board/board_write", object, HEADER);
    },
    // 글 수정
    boardEdit: async function(boardNo, category, title, detail) {
        const object = {
            boardNo: boardNo,
            category: category,
            title: title,
            detail: detail
        };
        return await axios.post(PLANNET_DOMAIN + "board/board_edit", object, HEADER);
    },
    // 글 삭제
    boardDelete: async function(boardNo) {
        const object = {
            boardNo : boardNo
        };
        return await axios.post(PLANNET_DOMAIN + "board/board_delete", object, HEADER);
    }
}

export default plannetApi;