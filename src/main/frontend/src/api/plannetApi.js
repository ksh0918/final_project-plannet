import axios from "axios";
const HEADER = 'application/json';
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
    // 첫 소셜로그인시 정보 불러오기
    memberNewSocialLoad: async function(id){
        const reg = {
            id : id,
        };
        return await axios.post(PLANNET_DOMAIN + "member/new_social_load", reg, HEADER);
    },
    // 첫 소셜로그인시 정보 저장하기
    memberNewSocialSave: async function(id, nickname, tel){
        const reg = {
            id : id,
            nickname : nickname,
            tel : tel,
        };
        return await axios.post(PLANNET_DOMAIN + "member/new_social_save", reg, HEADER);
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
    memberMemoSave: async function(id, memo) {
        const object = {
            id: id,
            memo: memo
        };
        return await axios.post(PLANNET_DOMAIN + "MemberMemoSave", object, HEADER);
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
    userInfoSave: async function(id, nickname, email, phone, profile) {
        const object = {
            id: id,
            nickname: nickname,
            email: email,
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
    commentsWrite: async function(boardNo, id, detail){
        return await axios.get(PLANNET_DOMAIN + `board/comments_write?boardNo=${boardNo}&id=${id}&detail=${detail}`, HEADER);
    },
    // 자유게시판 글 작성
    boardWrite: async function(id, title, detail, isChecked){
        const object = {
            id : id,
            title : title,
            detail : detail,
            isChecked : isChecked
        };
        return await axios.post(PLANNET_DOMAIN + "board/write", object, HEADER);
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
    // 글 삭제
    boardDelete: async function(num) {
        const object = {
            num : num
        };
        return await axios.post(PLANNET_DOMAIN + "board/delete", object, HEADER);
    }
}

export default plannetApi;