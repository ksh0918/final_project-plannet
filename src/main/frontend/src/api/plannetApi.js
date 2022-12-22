import { S3Outposts } from "aws-sdk";
import axios from "axios";
const HEADER = 'application/json';
//const PLANNET_DOMAIN = "http://plannet.shop/";
const PLANNET_DOMAIN = "http://localhost:8111/";

const plannetApi = {
    // MemberController
    // 로그인 기능
    userLogin: async function(id, pw) {
        const loginObj = {
            id: id,
            pwd: pw
        };
        return await axios.post(PLANNET_DOMAIN + "member/login", loginObj, HEADER);
    },
    // 소셜로그인
    socialLoginFindId: async function(email){
        return await axios.get(PLANNET_DOMAIN + `member/social_login_find_id?email=${email}`, HEADER);
    },
    // 첫 소셜로그인시 정보 저장하기
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
        return await axios.post(PLANNET_DOMAIN + `user/info_load?id=${id}`, HEADER);
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
        return await axios.post(PLANNET_DOMAIN + `user/nav_info?id=${id}`, HEADER);
    },

    // HomeController
    // 개인 home/달력/주간일정/메모/명언 출력
    personalHome: async function(id) {
        return await axios.post(PLANNET_DOMAIN + `home/personal?id=${id}`, HEADER);
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
        return await axios.post(PLANNET_DOMAIN + `write/load?id=${id}&date=${date}`, HEADER);
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


    // BoardController
    // 자유게시판 목록 출력
    boardList: async function(){
        return await axios.get(PLANNET_DOMAIN + "board/list", HEADER);
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
    boardViewsUp:async function(boardNo){
        return await axios.get(PLANNET_DOMAIN+ `board/views_up?boardNo=${boardNo}`, HEADER);
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
    likeCheckedToggle: async function(id, boardNo) {
        return await axios.get(PLANNET_DOMAIN + `board/like_checked_toggle?id=${id}&boardNo=${boardNo}`,HEADER);
    },
    // 해당 게시물에 작성된 댓글 불러오기
    commentLoad: async function(boardNo, offsetNum, limitNum){
        return await axios.post(PLANNET_DOMAIN + `board/comment_load?boardNo=${boardNo}&offsetNum=${offsetNum}&limitNum=${limitNum}`, HEADER);
    },
    // 해당 게시물에 댓글 작성
    commentWrite: async function(boardNo, id, detail){
        const object = {
            boardNo : boardNo,
            id : id,
            detail : detail
        }
        return await axios.post(PLANNET_DOMAIN + `board/comment_write`, object, HEADER);
    },
    // 해당 게시물에 댓글 삭제
    commentDelete: async function(commentNo){
        const object = {
            commentNo : commentNo
        }
        return await axios.post(PLANNET_DOMAIN + `board//comment_delete`, object, HEADER);
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
    boardEdit: async function(num, category, title, detail) {
        const object = {
            num: num,
            category: category,
            title: title,
            detail: detail
        };
        return await axios.post(PLANNET_DOMAIN + "board/board_edit", object, HEADER);
    },
    // 글 삭제
    boardDelete: async function(num) {
        const object = {
            num : num
        };
        return await axios.post(PLANNET_DOMAIN + "board/board_delete", object, HEADER);
    },

    // MessageController
    //쪽지 불러오기
    messageNoti : async function(id){
        return await axios.get(PLANNET_DOMAIN+`message/cntNoti?receiveId=${id}`,HEADER);
    },
    // 쪽지 리스트
    messageList: async function(id){
        return await axios.get(PLANNET_DOMAIN + `message/list?receiveId=${id}`, HEADER);
    },
    //쪽지 보내기
    messageSend : async function(id,receiveId,detail){
        const object = {
            id : id,
            receiveId : receiveId,
            detail : detail,
        };
        return await axios.post(PLANNET_DOMAIN+"message/send",object,HEADER);
    },
    //쪽지 삭제
    messageDelete: async function(obj){
        return await axios.post(PLANNET_DOMAIN+"message/delete",obj,HEADER);
    },
    //쪽지 읽음
    messageRead : async function(obj){
        return await axios.post(PLANNET_DOMAIN+"message/read",obj,HEADER);
    },
    //쪽지 읽음2
    messageReadModal : async function(messageNo){
        const object = {
            messageNo : messageNo    
        }
        return await axios.post(PLANNET_DOMAIN+"message/readModal",object,HEADER);
    },
    


    //NotiController
    //친구 추가 요청
    //친구 페이지 불러오기
    friendPageLoad: async function(id) {
        return await axios.get(PLANNET_DOMAIN + `noti/friend_load?id=${id}`, HEADER);
    },
    notiAddFriend: async function(id, keyword) {
        const object = {
            id: id,
            keyword: keyword
        };
        return await axios.post(PLANNET_DOMAIN + "noti/friend_add", object, HEADER);
    },
    //친구삭제
    notiUnfriend: async function(option) {
        const object = {
            key: option
        };
        return await axios.post(PLANNET_DOMAIN + "noti/unfriend", object, HEADER);
    },
    // 알림 승락거절
    // Post로 변경해야 함
    notiAnswer: async function(option) {
        return await axios.get(PLANNET_DOMAIN + `noti/noti_response${option}`, HEADER);
    },
    // 공유 캘린더 갯수 확인
    scalCheck: async function(id) {
        return await axios.get(PLANNET_DOMAIN + `noti/cnt_check?id=${id}`, HEADER);
    },

    // ScalController
    // 공유 캘린더 생성
    scalCreate: async function(id, title, checkedButtons) {
        const object = {
            id: id,
            title: title,
            checkedButtons: checkedButtons
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
    scalPlanLoad: async function(scalNo, date) {
        return await axios.get(PLANNET_DOMAIN + `scal/splan_load?scalNo=&{scalNo}&date=${date}`, HEADER);
    },
    // 공유 캘린더 일정 작성하기
    scalPlanSave: async function(scalNo, id, date, planList) {
        console.log("API는 지나옴");
        const object = {
            scalNo: scalNo,
            id: id, 
            date: date,
            planList: planList
        };
        return await axios.post(PLANNET_DOMAIN + "scal/splan_save", object, HEADER);
    },
    // 해당 캘린더에 작성된 댓글 불러오기
    scalCommentLoad: async function(scalNo, planDate) {
        return await axios.post(PLANNET_DOMAIN + `scal/comment_load?scalNo=${scalNo}&planDate=${planDate}`, HEADER);
    },
    // 해당 캘린더에 댓글 작성
    scalCommentWrite: async function(scalNo, id, planDate, detail){
        const object = {
            scalNo: scalNo,
            id: id,
            planDate: planDate,
            detail
        };
        return await axios.post(PLANNET_DOMAIN + "scal/comment_save", object, HEADER);
    },
    // 해당 캘린더에 댓글 삭제
    scalCommentDelete: async function(commentNo){
        const object = {
            commentNo: commentNo
        };
        return await axios.post(PLANNET_DOMAIN + "scal/comment_delete", object, HEADER);
    },
    // 공유 캘린더 정보 조회
    scalInfo: async function(scalNo, id) {
        return await axios.get(PLANNET_DOMAIN + `scal/info_load?calNo=${scalNo}&id=${id}`, HEADER);
    }
}

export default plannetApi;