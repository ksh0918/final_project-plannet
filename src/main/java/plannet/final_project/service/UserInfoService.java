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

@Service
@Slf4j
@RequiredArgsConstructor
public class UserInfoService {
    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;
    private final SMEMRepository smemRepository;
    private final SCALRepository scalRepository;
    private final SPLANRepository splanRepository;

    // 사용자 정보 수정
    public boolean saveUserInfo(String id, String nickname, String email, String phone, String sns, String profile) {
        try{
            Member mem = memberRepository.findById(id).orElseThrow(EmptyStackException::new);
            mem.setNickname(nickname);
            mem.setEmail(email);
            mem.setTel(phone);
            mem.setSNS(sns);
            mem.setProfile(profile);
            Member rst = memberRepository.save(mem);
            log.warn(rst.toString());
        } catch (Exception e) {
            return false;
        }
        return true;
    }
    // 사용자 프로필 이미지명 저장
    public boolean saveUserImg(String id, String imgName) {
        try {
            Member mem = memberRepository.findById(id).orElseThrow(EmptyStackException::new);
            mem.setProImg(imgName);
            Member rst = memberRepository.save(mem);
            log.warn(rst.toString());
        } catch(Exception e) {
            return false;
        }
        return true;
    }
    public MemberDTO userInfo (String userId) { // 사용자 정보 불러오기
        MemberDTO memberDTO = new MemberDTO();
        try{
            Member member = memberRepository.findById(userId).orElseThrow(EntityNotFoundException::new);

            // 멤버 인포
            memberDTO.setNickname(member.getNickname());
            memberDTO.setUserCode(member.getUserCode());
            memberDTO.setProfile(member.getProfile());
            memberDTO.setEmail(member.getEmail());
            memberDTO.setSns(member.getSNS());
            memberDTO.setTel(member.getTel());
            memberDTO.setProImg(member.getProImg());
            memberDTO.setOk(true);
        } catch (Exception e) {
            memberDTO.setOk(false);
        }
        return memberDTO;
    }

    //개인 일정 달성률/공유캘린더정보 불러오기
    public MemberDTO navInfo (String userId) {
        MemberDTO memberDTO = new MemberDTO();
        try{
            Member member = memberRepository.findById(userId).orElseThrow(EntityNotFoundException::new);

            //멤버달성률
            List<Plan> personalTotal = planRepository.findByUserId(member);
            List<Plan> personalEnd = planRepository.findByUserIdAndPlanChecked(member, 1);
            int personalTotalCnt = 0; // 총 일정 갯수
            int personalEndCnt = 0; // 완료된 일정 갯수
            for(Plan e : personalTotal) {
                personalTotalCnt++;
            }
            for(Plan e : personalEnd) {
                personalEndCnt++;
            }
            int personalPes = 0;
            try {
                personalPes = personalEndCnt * 100 / personalTotalCnt;
            } catch (ArithmeticException ignored) {}
            log.warn(String.valueOf(personalPes));
            memberDTO.setPes(personalPes);


            // 공유캘린더정보 불러오기
            List<SMEM> smemList = smemRepository.findByUserId(member);
            List<List<Object>> sCalList = new ArrayList<>();
            for(SMEM e : smemList){
                List<Object> sCal = new ArrayList<>();
                Long calNo = e.getCalNo().getCalNo(); // 캘린더 넘버
                String calName = e.getCalNo().getCalName(); // 캘린더 이름

                // 공유캘린더 일정 달성률 구하기
                SCAL scal = scalRepository.findById(calNo).orElseThrow(EntityNotFoundException::new);
                List<SPLAN> sPlanTotal = splanRepository.findByCalNo(scal);
                List<SPLAN> sPlanEnd = splanRepository.findByCalNoAndPlanChecked(scal, 1);
                int sPlanTotalCnt = 0; // 총 일정 갯수
                int sPlanEndCnt = 0; // 완료된 일정 갯수
                for(SPLAN f : sPlanTotal) {
                    sPlanTotalCnt++;
                }
                for(SPLAN f : sPlanEnd) {
                    sPlanEndCnt++;
                }

                int calPes = 0;
                try {
                    calPes = sPlanEndCnt * 100 / sPlanTotalCnt;
                } catch (ArithmeticException ignored) {}

                sCal.add(calNo);
                sCal.add(calName);
                sCal.add(calPes);
                sCalList.add(sCal);
            }

            memberDTO.setSCalList(sCalList);
            memberDTO.setOk(true);
        } catch (Exception e) {
            memberDTO.setOk(false);
        }

        return memberDTO;
    }

}
