package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.tool.schema.internal.exec.ScriptTargetOutputToFile;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.*;
import plannet.final_project.entity.*;
import plannet.final_project.vo.ShareDTO;

import javax.crypto.ExemptionMechanismException;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

// 의존성 주입을 받는다: 객체 생성 없이 사용할 수 있게 한다
@Slf4j // log를 찍기 위한 어노테이션
@Service
@Transactional
@RequiredArgsConstructor
public class ScalService {
    private final MemberRepository memberRepository;
    private final SCOMRepository scomRepository;
    private final SMEMRepository smemRepository;
    private final SPLANRepository splanRepository;
    private final SCALRepository scalRepository;

    // 내용 로드
    public ShareDTO homeList(Long calNo) {
        ShareDTO shareDTO = new ShareDTO();
        try{
            SCAL scal = scalRepository.findById(calNo).orElseThrow();
            // scal CalName Load
            shareDTO.setMemo(scal.getCalName());

            LocalDate[] weekDay = {
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.TUESDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.WEDNESDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.THURSDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.FRIDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.SATURDAY))
            };
//            List<List<Map<String, Object>>> weekPlan = new ArrayList<>();
//            for(int i = 0; i < 7; i++) {
//                List<Map<String, Object>> dayPlan = new ArrayList<>();
//                List<Plan> dayPlanOrigin = splanRepository.findByCalNoAndPlanDateOrderBySplanNoAsc(calNo, weekDay[i]);
//                for(Plan e : dayPlanOrigin) {
//                    Map<String, Object> plan = new HashMap<>();
//                    plan.put("no", e.getPlanNo());
//                    plan.put("plan", e.getPlan());
//                    plan.put("checked", e.getPlanChecked());
//                    dayPlan.add(plan);
//                }
//                weekPlan.add(dayPlan);
//            }
//            shareDTO.setWeekPlan(weekPlan);
//            // planMark
//            List<Set<LocalDate>> planMark = new ArrayList<>();
//            for(int i = 0; i < 2; i++) {
//                Set<LocalDate> planDot = new HashSet<>();
//                List<Plan> plan = splanRepository.findByCalNoAndPlanChecked(calNo, i);
//                for(Plan e : plan) {
//                    planDot.add(e.getPlanDate());
//                }
//                planMark.add(planDot);
//            }
//            shareDTO.setPlanMark(planMark);
            // memoLoad
            if(scal.getCalMemo() != null) {
                shareDTO.setMemo(scal.getCalMemo());
            } else shareDTO.setMemo("");

            // memberLoad
            List<Map<String, Object>> memberList = new ArrayList<>();
            SCAL scalNo = new SCAL();
            List<SMEM> memberListData = smemRepository.findByCalNo(scalNo);
            for (SMEM e : memberListData) {
                System.out.println("제대로 들어오니??");
                Map<String, Object> scalMember = new HashMap<>();
                scalMember.put("id", e.getUserId().getId());
                System.out.println("11111111111111111111");
                scalMember.put("isOwner", e.getIsOwner());
                System.out.println("222222222222222222222");
                scalMember.put("nickname", e.getUserId().getNickname());
                System.out.println("33333333333333333333");
                scalMember.put("userCode",      e.getUserId().getUserCode());
                System.out.println("4444444444444444444");
                memberList.add(scalMember);
                System.out.println("5555555555555555");
            }
            shareDTO.setMemberList(memberList);
            shareDTO.setOk(true);
        } catch (Exception e){
            shareDTO.setOk(false);
        }
        return shareDTO;
    }

    // 메모 수정
    public boolean memoWrite(Long calNo, String detail) {
        try {
            SCAL scal = scalRepository.findById(calNo).orElseThrow();
            scal.setCalMemo(detail);
            scalRepository.save(scal);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }
}
