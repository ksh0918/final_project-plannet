package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.*;
import plannet.final_project.entity.*;
import plannet.final_project.vo.MemberDTO;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.EmptyStackException;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final PlanRepository planRepository;
    private final DiaryRepository diaryRepository;
    private final FriendRepository friendRepository;
    private final MessageRepository messageRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    // 구글연동 계정인지, 일반계정인지 체크
    public String loginCheck (String id, String pwd){
        String result;
        try {
            Member member = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
            if(member.getPwd().equals(pwd)) { // 아이디와 비밀번호가 일치
                if (member.getSocial().equals("g")) result = "google"; // 소셜로그인 대상
                else result = "normal"; // 일반 사용자
            } else result = "no data"; // 로그인값도 일치하지 않고 소셜로그인 대상도 아님 = 회원 정보 없음
            return result;
        } catch (Exception e) {
            if(memberRepository.findByEmail(id).getSocial().equals("g")) { // 아이디로 적은 이메일이 소셜로그인 대상
                result = "google";
            } else { result = "no data"; }
            return result;
        }
    }

    // 구글 로그인 시 멤버 유형 구분
    public int googleLoginReg(String email) {
        Member member = memberRepository.findByEmail(email);
        if(member != null) { // 회원정보가 있으면 (null이 아니면)
            if(member.getSocial().equals("g")) return 0; //구글로 가입된 회원은 0
            else return 1; // 일반 회원은 1
        } else { // 구글로그인이 처음이면 2
            return 2;
        }
    }

    // 구글 연동 시 메일에서 아이디를 찾아옴
    public String socialLoginFindId(String email) {
        try{
            Member member = memberRepository.findByEmail(email);
            return member.getId();
        } catch (Exception e) {
            return "NOK";
        }
    }

    // 처음 구글 로그인 한 사람 회원가입
    public boolean newSocialSave(String id, String name, String email, String nickname, String tel) {
        try{
            Member member = new Member();
            member.setId(id);
            member.setPwd("-");
            member.setSocial("g");
            String userCode = String.format("%04d", (int)(Math.random() * 9999) + 1);
            member.setUserCode(userCode);
            member.setName(name);
            member.setNickname(nickname);
            member.setEmail(email);
            if(tel.length() != 0) member.setTel(tel);
            member.setJoinDate(LocalDateTime.now());
            member.setProImg("userdefault.png");
            memberRepository.save(member);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 회원가입
    public boolean memberReg(String id, String pwd, String name,
                             String nickname, String email, String tel) {
        try {
            Member member = new Member();
            member.setId(id);
            member.setPwd(pwd);
            member.setName(name);
            member.setNickname(nickname);
            member.setEmail(email);
            if(tel.length() != 0) member.setTel(tel);
            String userCode = String.format("%04d", (int)(Math.random() * 9999) + 1);
            member.setUserCode(userCode);
            member.setJoinDate(LocalDateTime.now());
            member.setProImg("userdefault.png");
            member.setSocial("-");
            log.warn("정보입력 완료");
            memberRepository.save(member);
            log.warn("저장 완료");
            return true;
        } catch (Exception e) {
            log.warn("Service 오류");
            return false;
        }
    }

    // 아이디, 이메일, 전화번호, 닉네임 중복체크
    public boolean overlapCheck(String keyword, String type){
        boolean isNotOverLap = true;
        try {
            Member member;
            char t = type.charAt(5);
            switch (t) {
                case 'I' :
                    member = memberRepository.findById(keyword).orElseThrow(null);
                    if(member != null) isNotOverLap = false;
                    else break;
                case 'E' :
                    member = memberRepository.findByEmail(keyword);
                    if(member != null) isNotOverLap = false;
                    else break;
                case 'T' :
                    member = memberRepository.findByTel(keyword);
                    if(member != null) isNotOverLap = false;
                    else break;
                case 'N' :
                    member = memberRepository.findByNickname(keyword);
                    if(member != null) isNotOverLap = false;
                    else break;
            }
            return isNotOverLap;
        } catch (Exception e){
            return isNotOverLap;
        }
    }

    // 아이디 및 비밀번호 찾기
    public MemberDTO memberFind(String keyword, String email, String type) {
        MemberDTO memDTO = new MemberDTO();
        try {
            char t = type.charAt(5);
            Member mem;
            switch (t) {
                case 'I' :
                    if(email.contains("@gmail.com")) {
                        memDTO.setReg(false);
                    } else {
                        mem = memberRepository.findByNameAndEmail(keyword, email);
                        if(mem != null) {
                            memDTO.setReg(true);
                            memDTO.setId(mem.getId());
                        } else {
                            memDTO.setReg(false);
                        }
                    }
                    memDTO.setOk(true);
                    break;
                case 'P' :
                    mem = memberRepository.findByIdAndEmail(keyword, email);
                    if(mem != null) memDTO.setReg(true);
                    else memDTO.setReg(false);
                    memDTO.setOk(true);
                    break;
            }
        } catch (Exception e) {
            memDTO.setOk(false);
        }
        return memDTO;
    }

    // 비밀번호 찾기 시 새 비밀번호 설정
    public boolean newPwd(String id, String pwd) {
        try {
            Member mem = memberRepository.findById(id).orElseThrow(EmptyStackException::new);
            mem.setPwd(pwd);
            Member rst = memberRepository.save(mem);
            log.warn(rst.toString());
        } catch(Exception e) {
            return false;
        }
        return true;
    }

    // 회원 탈퇴
    public boolean memberDelete(String id) {
        try {
            Member member = memberRepository.findById(id).orElseThrow();
            likeRepository.deleteByUserId(member);
            commentRepository.deleteByUserId(member);
            boardRepository.deleteByUserId(member);
            friendRepository.deleteByUserId(member);
            messageRepository.deleteByUserId(member);
            diaryRepository.deleteByUserId(member);
            planRepository.deleteByUserId(member);
            memberRepository.deleteById(id);
            return true;
        } catch (Exception e){
            log.warn("멤버 삭제 실패");
            return false;
        }
    }

    // 구글 계정으로 연동 (기존 gmail 가입 회원이)
    public String changeSocialLogin(String email) {
        try {
            Member member = memberRepository.findByEmail(email);
            member.setPwd("-");
            member.setSocial("g");
            memberRepository.save(member);
            return member.getId();
        } catch (Exception e) {
            return "NOK";
        }
    }
}