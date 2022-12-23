package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.*;
import plannet.final_project.entity.*;
import plannet.final_project.vo.MemberDTO;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.EmptyStackException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserInfoService {
    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;
    private final SCALRepository scalRepository;
    private final SMEMRepository smemRepository;
    private final SPLANRepository splanRepository;

    // 사용자 정보 불러오기
    public MemberDTO userInfoLoad (String userId) {
        MemberDTO memberDTO = new MemberDTO();
        try {
            Member member = memberRepository.findById(userId).orElseThrow(EntityNotFoundException::new);

            // 멤버 인포
            memberDTO.setNickname(member.getNickname());
            memberDTO.setUserCode(member.getUserCode());
            memberDTO.setProfile(member.getProfile());
            memberDTO.setEmail(member.getEmail());
            memberDTO.setTel(member.getTel());
            memberDTO.setProImg(member.getProImg());
            memberDTO.setOk(true);
        } catch (Exception e) {
            memberDTO.setOk(false);
        }
        return memberDTO;
    }

    // 사용자 정보 수정
    public boolean userInfoSave(String id, String nickname, String tel, String profile) {
        try{
            Member mem = memberRepository.findById(id).orElseThrow(EmptyStackException::new);
            mem.setNickname(nickname);
            mem.setTel(tel);
            mem.setProfile(profile);
            Member result = memberRepository.save(mem);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    // 사용자 프로필 이미지명 저장
    public boolean saveUserImg(String id, String imgName) {
        try {
            Member mem = memberRepository.findById(id).orElseThrow(EmptyStackException::new);
            mem.setProImg(imgName);
            Member result = memberRepository.save(mem);
        } catch(Exception e) {
            return false;
        }
        return true;
    }

    // 개인 일정 달성률/공유캘린더정보 불러오기
    public MemberDTO navInfoLoad (String userId) {
        MemberDTO memberDTO = new MemberDTO();
        try {
            Member member = memberRepository.findById(userId).orElseThrow(EntityNotFoundException::new);

            // 개인 일정 달성률 불러오기
            List<Plan> personalTotal = planRepository.findByUserId(member);
            List<Plan> personalComplete = planRepository.findByUserIdAndPlanChecked(member, 1);
            int personalTotalCnt = planRepository.countByUserId(member).intValue(); // 총 일정 갯수
            int personalCompleteCnt = planRepository.countByUserIdAndPlanChecked(member, 1).intValue(); // 완료된 일정 갯수
            for(Plan e : personalTotal) {
                personalTotalCnt++;
            }
            for(Plan e : personalComplete) {
                personalCompleteCnt++;
            }
            int personalPes = 0;
            try {
                personalPes = personalCompleteCnt * 100 / personalTotalCnt;
            } catch (ArithmeticException ignored) {}
            log.warn(String.valueOf(personalPes));
            memberDTO.setPes(personalPes);

            // 공유 캘린더 정보 불러오기
            List<SMEM> smemList = smemRepository.findByUserId(member);
            List<List<Object>> scalList = new ArrayList<>();
            for(SMEM e : smemList) {
                List<Object> scalData = new ArrayList<>();
                Long scalNo = e.getScalNo().getScalNo(); // 캘린더 넘버
                String scalName = e.getScalNo().getScalName(); // 캘린더 이름

                // 공유캘린더 일정 달성률 구하기
                SCAL scal = scalRepository.findById(scalNo).orElseThrow(EntityNotFoundException::new);
                List<SPLAN> splanTotal = splanRepository.findByScalNo(scal);
                List<SPLAN> splanComplete = splanRepository.findByScalNoAndSplanChecked(scal, 1);
                int splanTotalCnt = 0; // 총 일정 갯수
                int splanCompleteCnt = 0; // 완료된 일정 갯수
                for(SPLAN f : splanTotal) {
                    splanTotalCnt++;
                }
                for(SPLAN f : splanComplete) {
                    splanCompleteCnt++;
                }
                int scalPes = 0;
                try { scalPes = splanCompleteCnt * 100 / splanTotalCnt; }
                catch (ArithmeticException ignored) {}

                scalData.add(scalNo);
                scalData.add(scalName);
                scalData.add(scalPes);
                scalList.add(scalData);
            }
            memberDTO.setSCalList(scalList);
            memberDTO.setOk(true);
        } catch (Exception e) {
            memberDTO.setOk(false);
        }
        return memberDTO;
    }
}