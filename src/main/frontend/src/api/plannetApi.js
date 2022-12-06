
import axios from "axios";
const HEADER = 'application/json';
const PLANNET_DOMAIN = "http://localhost:8111/";

const plannetApi = {
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
    // 회원 탈퇴
    memberDelete: async function(id) {
        const memberObj = {
            id: id,
        };
        return await axios.post(PLANNET_DOMAIN + "member/member_delete", memberObj, HEADER);
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
    // 회원 메모 저장
    memberMemoSave: async function(id, memo) {
        const object = {
            id: id,
            memo: memo
        };
        return await axios.post(PLANNET_DOMAIN + "MemberMemoSave", object, HEADER);
    },
    // 플랜리스트.다이어리 저장
    writeSave: async function(id, date, planList, diary) {
        const object = {
            id: id,
            date: date,
            plan: planList,
            diary: diary
        };
        return await axios.post(PLANNET_DOMAIN + "WriteSave", object, HEADER);
    }, 
    // 플랜리스트.다이어리 로드
    writeLoad: async function(id, date) {
        const object = {
            id: id,
            date: date
        };
        return await axios.post(PLANNET_DOMAIN + "write/load", object, HEADER);
    },
    // 자유게시판 목록 출력
    boardList: async function(){
        return await axios.get(PLANNET_DOMAIN + "board/list", HEADER);
    },
    // 자유게시판 글 작성
    boardCreate: async function(id, title, detail, isChecked){
        const object = {
            id : id,
            title : title,
            detail : detail,
            isChecked : isChecked
        };
        return await axios.post(PLANNET_DOMAIN + "board/write", object, HEADER);
    },
    // 글 조회수 
    boardViewsUp:async function(boardNo){
        console.log("제대로들어옴?");
        return await axios.get(PLANNET_DOMAIN+ `board/views_up?boardNo=${boardNo}`, HEADER);
    },
    // 게시판 내용보기
    postView: async function(boardNo){
        return await axios.get(PLANNET_DOMAIN + `board/post_view?boardNo=${boardNo}`, HEADER);
    },
    // 글 삭제
    boardDelete: async function(num) {
        const object = {
            num : num
        };
        return await axios.post(PLANNET_DOMAIN + "board/delete", object, HEADER);
    },
    // 글 수정
    boardEdit: async function(id, num, title, detail) {
        const object = {
            id: id,
            num: num,
            title: title,
            detail: detail
        };
        return await axios.post(PLANNET_DOMAIN + "board/edit", object, HEADER);
    },
    // 좋아요 수 불러오기
    likeCnt: async function(boardNo) {
        return await axios.get(PLANNET_DOMAIN + `board/like_cnt?boardNo=${boardNo}`, HEADER);
    },
    // 좋아요 여부 불러오기
    likeChecked: async function(id, boardNo) {
        return await axios.get(PLANNET_DOMAIN + `board/like_checked?id=${id}&boardNo=${boardNo}`, HEADER);
    },
    // 해당 게시물에 좋아요를 눌렀는지 체크
    likeCheckedToggle: async function(id, boardNo) {
        return await axios.get(PLANNET_DOMAIN + `board/like_checked_toggle?id=${id}&boardNo=${boardNo}`,HEADER);
    },
    // 해당 게시물에 댓글 작성
    boardCommentCreate: async function(boardNo, id, detail){
        return await axios.get(PLANNET_DOMAIN + `board/comment_write?boardNo=${boardNo}&id=${id}&detail=${detail}`, HEADER);
    },
    // 해당 게시물에 작성된 댓글 불러오기
    boardCommentLoad: async function(boardNo){
        console.log(boardNo);
        const object = {
            boardNo : boardNo
        };
        return await axios.post(PLANNET_DOMAIN + "board/comment_load", object, HEADER);
    },
    // userInfo 불러오기 - userinfoController-userinfoload
    userInfoLoad: async function(id){
        const object = {
            id:id
        };
        return await axios.post(PLANNET_DOMAIN + "user/info_load", object, HEADER);
    },
    // NavInfo 불러오기 - userinfoController-NavInfo
    userNavInfo: async function(id){
        const object = {
            id:id
        };
        return await axios.post(PLANNET_DOMAIN + "user/nav_info", object, HEADER);
    },
    // userInfo 저장하기
    userInfoSave: async function(id, nickname, email, phone, sns, profile) {
        const object = {
            id: id,
            nickname: nickname,
            email: email,
            phone: phone,
            sns: sns,
            profile: profile
        };
        return await axios.post(PLANNET_DOMAIN + "user/info_save", object, HEADER);
    },
    userImgSave: async function(id, imgName) {
        const object = {
            id: id,
            imgName: imgName
        };
        return await axios.post(PLANNET_DOMAIN + "UserImgSave", object, HEADER);
    },
    // 개인 home/달력/주간일정/메모/명언 출력
    personalHome: async function(id) {
        const object = {
            id: id
        };
        return await axios.post(PLANNET_DOMAIN + "home/personal", object, HEADER);
    }
}

export default plannetApi;


