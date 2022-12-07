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


@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final CommentsRepository commentsRepository;
    private final DiaryRepository diaryRepository;
    private final LikeCntRepository likeCntRepository;
    private final FriendRepository friendRepository;
    private final MessageRepository messageRepository;
    private final PlanRepository planRepository;
    private final SCOMRepository scomRepository;
    private final SMEMRepository smemRepository;
    private final SPLANRepository splanRepository;
    private final SCALRepository scalRepository;

    public boolean loginCheck (String id, String pwd){
        try {
            return memberRepository.findById(id).orElseThrow(EntityNotFoundException::new).getPwd().equals(pwd);
        } catch (Exception e) {
            return false;
        }
    }
    public boolean regMember(String id,String pwd,String name,
                             String nickname,String email,String tel){
        try {
            Member member = new Member();
            member.setId(id);
            member.setPwd(pwd);
            member.setName(name);
            member.setNickname(nickname);
            member.setEmail(email);
            member.setTel(tel);
            String userCode = String.format("%04d", (int)(Math.random() * 9999) + 1);
            member.setUserCode(userCode);
            member.setJoinDate(LocalDateTime.now());
            log.warn("정보입력 완료");
            memberRepository.save(member);
            log.warn("저장 완료");
            return true;
        }catch (Exception e){
            log.warn("Service 오류");
            return false;
        }
    }
    public boolean overlapCheck (String uni, String type){
        boolean isNotOverLap = true;
        try{
            Member member;
            char t = type.charAt(5);
            switch (t){
                case 'I' :
                    member = memberRepository.findById(uni).orElseThrow(null);
                    if(member != null) isNotOverLap = false;
                    else break;
                case 'E' :
                    member = memberRepository.findByEmail(uni);
                    if(member != null) isNotOverLap = false;
                    else break;
                case 'T' :
                    member = memberRepository.findByTel(uni);
                    if(member != null) isNotOverLap = false;
                    else break;
            }
            return isNotOverLap;
        } catch (Exception e){
            return isNotOverLap;
        }

    }
    // 아이디 비밀번호 찾기
    public MemberDTO memberFindCheck(String uni, String email, String type) {
        MemberDTO memDTO = new MemberDTO();
        try{
            char t = type.charAt(5);
            Member mem = new Member();

            switch (t) {
                case 'I' :
                    mem = memberRepository.findByNameAndEmail(uni, email);
                    if(mem != null) {
                        memDTO.setReg(true);
                        memDTO.setId(mem.getId());
                    } else {
                        memDTO.setReg(false);
                    }
                    memDTO.setOk(true);
                    break;
                case 'P' :
                    mem = memberRepository.findByIdAndEmail(uni, email);
                    if(mem != null) {
                        memDTO.setReg(true);
                    } else {
                        memDTO.setReg(false);
                    }
                    memDTO.setOk(true);
                    break;
            }
        } catch (Exception e) {
            memDTO.setOk(false);
        }
        return memDTO;
    }
    // 비밀번호 찾기 시 새 비밀번호 설정
    public boolean regNewPwd(String id, String pwd) {
        try{
            Member mem = memberRepository.findById(id).orElseThrow(EmptyStackException::new);
            mem.setPwd(pwd);
            Member rst = memberRepository.save(mem);
            log.warn(rst.toString());
        } catch(Exception e) {
            return false;
        }
        return true;
    }
    public boolean deleteMember(String id){
        try {
            Member member = memberRepository.findById(id).orElseThrow();
            likeCntRepository.deleteByUserId(member);
            commentsRepository.deleteByUserId(member);
            boardRepository.deleteByUserId(member);
            diaryRepository.deleteByUserId(member);
            friendRepository.deleteByUserId(member);
            messageRepository.deleteByUserId(member);
            planRepository.deleteByUserId(member);
            // 공유안한 사람은 삭제 가능
            scomRepository.deleteByUserId(member);
            smemRepository.deleteByUserId(member);
            splanRepository.deleteByUserId(member);
            log.warn("scal 전 완료");
            scalRepository.deleteByUserId(member);
            memberRepository.deleteById(id);
            return true;
        }catch (Exception e){
            log.warn("실패구역");
            return false;
        }
    }
}
