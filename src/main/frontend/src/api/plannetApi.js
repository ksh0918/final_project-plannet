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
    // 회원 가입 여부 확인
    memberRegCheck: async function(uni, type) {
        const regCheck = {
            uni: uni,
            type: type
        };
        return await axios.post(PLANNET_DOMAIN + "member/overlap_check", regCheck, HEADER);
    },
    // 회원 아이디, 비밀번호 찾기
    memberFind: async function(uni, email, type){
        const reg = {
            uni : uni,
            email : email,
            type : type
        };
        return await axios.post(PLANNET_DOMAIN + "member/find_check", reg, HEADER);
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
    // 소셜로그인
    socialLoginFindId: async function(email){
        const reg = {
            email : email,
        };
        return await axios.post(PLANNET_DOMAIN + "member/social_login_find_id", reg, HEADER);
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
    // EmailController
    // 이메일 인증
    emailAuthCheck : async function(email){
        const object = {
            email : email
        };
        return await axios.post(PLANNET_DOMAIN+"login/mailConfirm",object,HEADER);
    },
    // HomeController
    // 개인 home/달력/주간일정/메모/명언 출력
    personalHome: async function(id) {
        const object = {
            id: id
        };
        return await axios.post(PLANNET_DOMAIN + "home/personal", object, HEADER);
    },
    // 회원 메모 저장
    memoSave: async function(id, detail) {
        const object = {
            id: id,
            detail: detail
        };
        return await axios.post(PLANNET_DOMAIN + "home/memo", object, HEADER);
    },

    // UserInfoController
    // userInfo 불러오기 - userinfoController-userinfoload
    userInfoLoad: async function(id){
        const object = {
            id:id
        };
        return await axios.post(PLANNET_DOMAIN + "user/info_load", object, HEADER);
    },
    // userInfo 저장하기
    userInfoSave: async function(id, nickname, phone, profile) {
        const object = {
            id: id,
            nickname: nickname,
            phone: phone,
            profile: profile
        };
        return await axios.post(PLANNET_DOMAIN + "user/info_save", object, HEADER);
    },
    userImgSave: async function(id, imgName) {
        const object = {
            id: id,
            imgName: imgName
        };
        return await axios.post(PLANNET_DOMAIN + "user/img_save", object, HEADER);
    },
    // NavInfo 불러오기 - userinfoController-NavInfo
    userNavInfo: async function(id){
        const object = {
            id:id
        };
        return await axios.post(PLANNET_DOMAIN + "user/nav_info", object, HEADER);
    },

    // WriteController
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
    // 플랜리스트.다이어리 로드
    writeLoad: async function(id, date) {
        const object = {
            id: id,
            date: date
        };
        return await axios.post(PLANNET_DOMAIN + "write/load", object, HEADER);
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
    commentsLoad: async function(boardNo){
        console.log(boardNo);
        const object = {
            boardNo : boardNo
        };
        return await axios.post(PLANNET_DOMAIN + "board/comments_load", object, HEADER);
    },
    // 해당 게시물에 댓글 작성
    commentWrite: async function(boardNo, id, detail){
        return await axios.get(PLANNET_DOMAIN + `board/comments_write?boardNo=${boardNo}&id=${id}&detail=${detail}`, HEADER);
    },
    // 해당 게시물에 댓글 삭제
    commentDelete: async function(commentNo){
        return await axios.get(PLANNET_DOMAIN + `board/comments_delete?commentNo=${commentNo}`, HEADER);
    },
    // 자유게시판 글 작성
    boardWrite: async function(id, title, detail, isChecked){
        const object = {
            id : id,
            title : title,
            detail : detail,
            isChecked : isChecked
        };
        return await axios.post(PLANNET_DOMAIN + "board/board_write", object, HEADER);
    },
    // 글 수정
    boardEdit: async function(id, num, title, detail) {
        const object = {
            id: id,
            num: num,
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
    //쪽지 불러오기
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
    //친구 추가 요청
    notiAddFriend: async function(id, keyword) {
        const object = {
            id: id,
            keyword: keyword
        };
        return await axios.post(PLANNET_DOMAIN + "noti/add_friend", object, HEADER);
    },
    //친구삭제
    notiUnfriend: async function(option) {
        const object = {
            key: option
        };
        return await axios.post(PLANNET_DOMAIN + "noti/unfriend", object, HEADER);
    },
    //친구 페이지 불러오기
    friendPageLoad: async function(id) {
        return await axios.get(PLANNET_DOMAIN + `noti/friend_page_load?id=${id}`, HEADER);
    },
    //알림 승락거절
    notiAnswer: async function(option) {
        return await axios.get(PLANNET_DOMAIN + `noti/noti_answer${option}`, HEADER);
    },
    // 공유 캘린더 갯수 확인
    scalCheck: async function(id) {
        return await axios.get(PLANNET_DOMAIN + `noti/check?id=${id}`, HEADER);
    },
    // 공유 캘린더 생성
    scalCreate: async function(id, title, checkedButtons) {
        const object = {
            id: id,
            title: title,
            checkedButtons: checkedButtons
        };
        return await axios.post(PLANNET_DOMAIN + "scal/create", object, HEADER);
    },
    // 공유 캘린더 home/달력/주간일정/메모/명언 출력
    sharingHome: async function(calNo) {
        return await axios.get(PLANNET_DOMAIN + `scal/sharing?calNo=${calNo}`, HEADER);
    },
    // 공유 캘린더 메모 저장
    scalMemoSave: async function(calNo, detail) {
        const object = {
            calNo: calNo,
            detail: detail
        };
        return await axios.post(PLANNET_DOMAIN + "scal/memo", object, HEADER);
    },
    // 공유 캘린더 일정 불러오기
    scalPlanLoad: async function(calNo, date) {
        const object = {
            calNo: calNo,
            date: date
        };
        return await axios.post(PLANNET_DOMAIN + "scal/plan_load", object, HEADER);
    },
    // 공유 캘린더 일정 작성하기
    scalPlanSave: async function(id, calNo, date, planList) {
        console.log("API는 지나옴");
        const object = {
            id: id, 
            calNo: calNo,
            date: date,
            planList: planList
        };
        return await axios.post(PLANNET_DOMAIN + "scal/plan_save", object, HEADER);
    },
    
    // 해당 캘린더에 작성된 댓글 불러오기
    scalCommentsLoad: async function(calNo, date) {
        const object = {
            calNo: calNo,
            date: date
        }
        return await axios.post(PLANNET_DOMAIN + "scal/comments_load", object, HEADER);
    },
    // 해당 캘린더에 댓글 작성
    scalCommentWrite: async function(calNo, date, id, detail){
        const object = {
            calNo: calNo,
            date: date,
            id: id,
            detail
        };
        return await axios.post(PLANNET_DOMAIN + "scal/comment_write", object, HEADER);
    },
    // 해당 캘린더에 댓글 삭제
    scalCommentDelete: async function(commentNo){
        const object = {
            commentNo: commentNo
        };
        return await axios.post(PLANNET_DOMAIN + "scal/comment_delete", object, HEADER);
    },
    // 공유 캘린더 멤버 추가 요청
        scalAddMember: async function(id, keyword) {
        const object = {
            id: id,
            keyword: keyword
        };
        return await axios.post(PLANNET_DOMAIN + "scal/invite_member", object, HEADER);
    },

}

export default plannetApi;