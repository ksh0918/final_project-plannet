import { S3Outposts } from "aws-sdk";
import axios from "axios";
const HEADER = 'application/json';
//const PLANNET_DOMAIN = "http://plannet.shop/";
const PLANNET_DOMAIN = "http://localhost:8111/";

const plannetApi = {
    // MemberController
    // 로그인 기능 (구글 연동 계정인지, 일반 계정인지 체크)
    memberLogin: async function(id, pw) {
        const loginObj = {
            id: id,
            pwd: pw
        };
        return await axios.post("member/login", loginObj);
    },
    // 구글 연동 시 메일에서 아이디를 찾아옴
    socialLoginFindId: async function(email){
        return await axios.get(`member/social_login_find_id?email=${email}`);
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
        return await axios.post("member/new_social_save", reg);
    },
    // 회원 가입
    memberReg: async function(id, pwd, name, nickname, email, tel, optInResult) {
        const memberObj = {
            id: id,
            pwd: pwd,
            name: name,
            nickname: nickname,
            email: email,
            tel: tel,
            optInResult: optInResult,
        };
        return await axios.post("member/register", memberObj);
    },
    // 아이디, 이메일, 전화번호, 닉네임 중복체크
    overlapCheck: async function(keyword, type) { 
        const regCheck = {
            keyword: keyword,
            type: type
        };
        return await axios.post("member/overlap_check", regCheck);
    },
    // 회원 아이디, 비밀번호 찾기
    memberFind: async function(keyword, email, type){
        return await axios.get(`member/find?keyword=${keyword}&email=${email}&type=${type}`);
    },
    // 비밀번호 찾기 시 새 비밀번호 저장
    memberNewPwd: async function(id, pwd){
        const reg = {
            id : id,
            pwd : pwd
        };
        return await axios.post("member/new_pwd", reg);
    },
    // 회원 탈퇴
    memberDelete: async function(id) {
        const memberObj = {
            id: id,
        };
        return await axios.post("member/delete", memberObj);
    },
    // 일반로그인에서 > 소셜로그인으로 전환 (구글 계정으로 연동)
    changeSocialLogin: async function(email){ 
        const reg = {
            email : email,
        };
        return await axios.post("member/change_social_login", reg);
    },

    // EmailController
    // 이메일 인증
    emailAuthCheck : async function(email){
        const object = {
            email : email
        };
        return await axios.post("login/mailConfirm",object);
    },

    // UserInfoController
    // 사용자 정보 불러오기
    userInfoLoad: async function(id){
        return await axios.get(`user/info_load?id=${id}`);
    },
    // 사용자 정보 수정하기
    userInfoSave: async function(id, nickname, tel, profile) {
        const object = {
            id: id,
            nickname: nickname,
            tel: tel,
            profile: profile
        };
        return await axios.post("user/info_save", object);
    },
    // 사용자 프로필 이미지명 저장
    userImgSave: async function(id, imgName) {
        const object = {
            id: id,
            imgName: imgName
        };
        return await axios.post("user/img_save", object);
    },
    // Nav바 정보 불러오기
    userNavInfo: async function(id){
        return await axios.get(`user/nav_info?id=${id}`);
    },

    //NotiController
    // 친구 불러오기
    friendLoad: async function(id) {
        return await axios.get(`noti/friend_load?id=${id}`);
    },
    // 친구 추가하기
    friendAdd: async function(id, keyword) {
        const object = {
            id: id,
            keyword: keyword
        };
        return await axios.post("noti/friend_add", object);
    },
    // 친구 삭제하기
    unfriend: async function(option) {
        const object = {
            key: option
        };
        return await axios.post("noti/unfriend", object);
    },
    // 알림 승락/거절
    notiResponse: async function(key, status) {
        const object = {
            key: key,
            status: status
        };
        return await axios.post("noti/noti_response", object);
    },
    // 공유 캘린더 갯수 확인하기
    scalCntCheck: async function(id) {
        return await axios.get(`noti/cnt_check?id=${id}`);
    },

    // MessageController
    // 쪽지 갯수 불러오기 (말풍선)
    messageCntNoti : async function(id){
        return await axios.get(`message/cntNoti?receiveId=${id}`);
    },
    // 쪽지 리스트 불러오기
    messageList: async function(id){
        return await axios.get(`message/list?receiveId=${id}`);
    },
    // 쪽지 보내기
    messageSend : async function(id, receiveId, detail){
        const object = {
            id : id,
            receiveId : receiveId,
            detail : detail,
        };
        return await axios.post("message/send", object);
    },
    // 쪽지 삭제
    messageDelete: async function(obj){
        return await axios.post("message/delete", obj);
    },
    // 쪽지 읽음 표시
    messageRead : async function(obj){
        return await axios.post("message/read", obj);
    },
    // 쪽지를 읽을 때 모달을 띄워 줌
    messageModalOpen : async function(messageNo){
        const object = {
            messageNo : messageNo
        }
        return await axios.post("message/readModal", object);
    },
    // 쪽지 검색하기
    searchMessageList: async function(receive_id, keyword){
        return await axios.get(`message/search_messageList?receive_id=${receive_id}&keyword=${keyword}`);
    },

    // HomeController
    // 개인 home/달력/주간일정/메모/명언 불러오기
    personalHome: async function(id) {
        return await axios.get(`home/personal?id=${id}`);
    },
    // 회원 메모 저장하기
    memoSave: async function(id, detail) {
        const object = {
            id: id,
            detail: detail
        };
        return await axios.post("home/memo", object);
    },

    // WriteController
    // 일정 불러오기 (플랜리스트, 다이어리 로드)
    writeLoad: async function(id, date) {
        return await axios.get(`write/load?id=${id}&date=${date}`);
    },
    // 일정 저장하기 (플랜리스트, 다이어리 저장)
    writeSave: async function(id, date, planList, diary) {
        const object = {
            id: id,
            date: date,
            plan: planList,
            diary: diary
        };
        return await axios.post("/save", object);
        },

    // ScalController
    // 공유 캘린더 생성하기
    scalCreate: async function(id, title, checkedButton) {
        const object = {
            id: id,
            title: title,
            checkedButton: checkedButton
        };
        return await axios.post("scal/create", object);
    },
    // 공유 캘린더 삭제하기
    scalDelete: async function(scalNo) {
        const object = {
            scalNo: scalNo
        };
        return await axios.post("scal/delete", object);
    },
    // 공유 캘린더 멤버 초대하기
    smemInvite: async function(scalNo, id) {
        const object = {
            scalNo: scalNo,
            id: id
        };
        return await axios.post("scal/member_invite", object);
    },
    // 공유 캘린더 멤버 삭제하기
    smemDelete: async function(scalNo, id) {
        const object = {
            scalNo: scalNo,
            id: id
        };
        return await axios.post("scal/member_delete", object);
    }, // 공유 캘린더 정보 저장하기
    scalInfoSave: async function(scalNo, scalName) {
        const object = {
            scalNo: scalNo,
            scalName: scalName
        };
        return await axios.post("scal/info_save", object);
    },
    // 해당 공유 캘린더 home/달력/주간일정/메모/명언 불러오기
    sharingHome: async function(scalNo) {
        return await axios.get(`scal/sharing?scalNo=${scalNo}`);
    },
    // 해당 공유 캘린더 메모 저장
    scalMemoSave: async function(scalNo, detail) {
        const object = {
            scalNo: scalNo,
            detail: detail
        };
        return await axios.post("scal/memo", object);
    },
    // 공유 캘린더 일정 불러오기
    splanLoad: async function(scalNo, planDate) {
        return await axios.get(`scal/splan_load?scalNo=${scalNo}&planDate=${planDate}`);
    },
    // 공유 캘린더 일정 작성하기
    splanSave: async function(scalNo, id, date, planList) {
        const object = {
            scalNo: scalNo,
            id: id,
            date: date,
            planList: planList
        };
        return await axios.post("scal/splan_save", object);
    },
    // 해당 공유 캘린더에 작성된 댓글 불러오기
    scommentLoad: async function(scalNo, planDate) {
        return await axios.get(`scal/scomment_load?scalNo=${scalNo}&planDate=${planDate}`);
    },
    // 해당 공유 캘린더에 댓글 작성하기
    scommentWrite: async function(scalNo, id, planDate, detail){
        const object = {
            scalNo: scalNo,
            id: id,
            planDate: planDate,
            detail
        };
        return await axios.post("scal/comment_save", object);
    },
    // 해당 공유 캘린더에 댓글 삭제하기
    scommnetDelete: async function(commentNo){
        const object = {
            commentNo: commentNo
        };
        return await axios.post("scal/comment_delete", object);
    },
    // 공유 캘린더 정보 불러오기
    scalInfo: async function(scalNo, id) {
        return await axios.get(`scal/info_load?scalNo=${scalNo}&id=${id}`);
    },
    // 공유 캘린더 멤버 추가 요청
        scalAddMember: async function(id, keyword) {
        const object = {
            id: id,
            keyword: keyword
        };
        return await axios.post("scal/invite_member", object);
    },

    // BoardController
    // 전체 자유게시판 목록 불러오기
    boardList: async function(){
        return await axios.get("board/board_list");
    },
    // 인기글 top3 목록 불러오기
    top3List: async function(){
        return await axios.get("board/top3_list");
    },
    // 자유게시판 검색 키워드에 해당하는 리스트 불러오기
    searchList: async function(keyword){
        return await axios.get(`board/search_list?keyword=${keyword}`);
    },
    // 특정 보드넘버의 게시물 내용 + 좋아요 수 불러오기
    postView: async function(boardNo){
        return await axios.get(`board/post_view?boardNo=${boardNo}`);
    },
    // boardNo의 게시물을 내가 작성하지 않았으면 조회수 +1
    boardViewUp:async function(boardNo){
        const object = {
            boardNo: boardNo
        }
        return await axios.post("board/view_up", object);
    },
    // boardNo에 해당하는 좋아요 수 불러오기
    likeCnt: async function(boardNo) {
        return await axios.get(`board/like_cnt?boardNo=${boardNo}`);
    },
    // boardNo로 내가 해당 게시물에 좋아요를 눌렀는지 조회하기
    likeChecked: async function(id, boardNo) {
        return await axios.get(`board/like_checked?id=${id}&boardNo=${boardNo}`);
    },
    // 좋아요 버튼을 눌렀을 때 toggle 밑 데이터베이스 변경
    likeCheckedToggle: async function(boardNo, id) {
        const object = {
            boardNo : boardNo,
            id : id,
        }
        return await axios.post("board/like_checked_toggle", object);
    },
    // 해당 게시물에 작성된 댓글 불러오기
    commentLoad: async function(boardNo){
        return await axios.get(`board/comment_load?boardNo=${boardNo}`);
    },
    // 해당 게시물에 댓글 작성하기
    commentWrite: async function(boardNo, id, detail){
        const object = {
            boardNo : boardNo,
            id : id,
            detail : detail
        }
        return await axios.post("board/comment_write", object);
    },
    // 해당 게시물에 댓글 삭제하기
    commentDelete: async function(commentNo){
        const object = {
            commentNo : commentNo
        }
        return await axios.post("board/comment_delete", object);
    },
    // 자유게시판 글 작성하기
    boardWrite: async function(id, category, title, detail, isChecked){
        const object = {
            id : id,
            category: category,
            title : title,
            detail : detail,
            isChecked : isChecked
        };
        return await axios.post("board/board_write", object);
    },
    // 자유게시판 글 수정하기
    boardEdit: async function(boardNo, category, title, detail) {
        const object = {
            boardNo: boardNo,
            category: category,
            title: title,
            detail: detail
        };
        return await axios.post("board/board_edit", object);
    },
    // 자유게시판 글 삭제하기
    boardDelete: async function(boardNo) {
        const object = {
            boardNo : boardNo
        };
        return await axios.post("board/board_delete", object);
    }
}

export default plannetApi;