package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.*;
import plannet.final_project.entity.*;
import plannet.final_project.vo.ShareDTO;
import plannet.final_project.entity.Diary;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Plan;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

// 의존성 주입을 받는다: 객체 생성 없이 사용할 수 있게 한다
@Slf4j // log를 찍기 위한 어노테이션
@Service
@Transactional
@RequiredArgsConstructor
public class ScalService {
    private final SMEMRepository smemRepository;
    private final SPLANRepository splanRepository;
    private final SCALRepository scalRepository;
    private final MemberRepository memberRepository;
    private final DiaryRepository diaryRepository;
    private final PlanRepository planRepository;

    // 내용 로드
    public ShareDTO homeList(Long calNo) {
        ShareDTO shareDTO = new ShareDTO();
        SCAL scal = scalRepository.findById(calNo).orElseThrow();
        try{
            // scal CalName Load
            shareDTO.setCalName(scal.getCalName());

            // plan Load
            LocalDate[] weekDay = {
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.TUESDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.WEDNESDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.THURSDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.FRIDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.SATURDAY))
            };
            List<List<Map<String, Object>>> weekPlan = new ArrayList<>();
            for(int i = 0; i < 7; i++) {
                List<Map<String, Object>> dayPlan = new ArrayList<>();
                List<SPLAN> dayPlanOrigin = splanRepository.findByCalNoAndPlanDateOrderBySplanNoAsc(scal, weekDay[i]);
                for(SPLAN e : dayPlanOrigin) {
                    Map<String, Object> plan = new HashMap<>();
                    plan.put("no", e.getSplanNo());
                    plan.put("plan", e.getPlan());
                    plan.put("checked", e.getPlanChecked());
                    dayPlan.add(plan);
                }
                weekPlan.add(dayPlan);
            }
            shareDTO.setWeekPlan(weekPlan);

            // planMark Load
            List<Set<LocalDate>> planMark = new ArrayList<>();
            for(int i = 0; i < 2; i++) {
                Set<LocalDate> planDot = new HashSet<>();
                List<SPLAN> plan = splanRepository.findByCalNoAndPlanChecked(scal, i);
                for(SPLAN e : plan) {
                    planDot.add(e.getPlanDate());
                }
                planMark.add(planDot);
            }
            shareDTO.setPlanMark(planMark);

            // Memo Load
            if(scal.getCalMemo() != null) {
                shareDTO.setMemo(scal.getCalMemo());
            } else shareDTO.setMemo("");

            // Member Load
            List<Map<String, Object>> memberList = new ArrayList<>();
            SCAL scalNo = scalRepository.findById(calNo).orElseThrow(EntityNotFoundException::new);
            List<SMEM> memberListData = smemRepository.findByCalNo(scalNo);
            for (SMEM e : memberListData) {
                Map<String, Object> scalMember = new HashMap<>();
                scalMember.put("id", e.getUserId().getId());
                scalMember.put("isOwner", e.getIsOwner());
                scalMember.put("nickname", e.getUserId().getNickname());
                scalMember.put("userCode", e.getUserId().getUserCode());
                memberList.add(scalMember);
            }
            shareDTO.setMemberList(memberList);
            shareDTO.setOk(true);
        } catch (Exception e){
            shareDTO.setOk(false);
        }
        return shareDTO;
    }

    // 메모 불러오기 & 수정
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

    // 일정 불러오기
    public ShareDTO planLoad(Long calNo, LocalDate date) {
        ShareDTO shareDTO = new ShareDTO();
        try{
            SCAL scal = scalRepository.findById(calNo).orElseThrow();
            List<SPLAN> plans = splanRepository.findByCalNoAndPlanDateOrderBySplanNoAsc(scal, date);
            List<Map<String, Object>> planList = new ArrayList<>();
            for (SPLAN e : plans) {
                Map<String, Object> plan = new HashMap<>();
                plan.put("key", e.getSplanNo());
                plan.put("checked", e.getPlanChecked());
                plan.put("text", e.getPlan());
                plan.put("deleted", false);
                planList.add(plan);
            }
            shareDTO.setPlanList(planList);
            shareDTO.setOk(true);
        } catch (Exception e) {
            shareDTO.setOk(false);
        }
        return shareDTO;
    }
}