package plannet.final_project.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.DiaryRepository;
import plannet.final_project.dao.MemberRepository;
import plannet.final_project.dao.PlanRepository;
import plannet.final_project.entity.Diary;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Plan;
import plannet.final_project.vo.WriteDTO;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class WriteService {
    private MemberRepository memberRepository;
    private DiaryRepository diaryRepository;
    private PlanRepository planRepository;

    public WriteService(MemberRepository memberRepository, DiaryRepository diaryRepository, PlanRepository planRepository) {
        this.memberRepository = memberRepository;
        this.diaryRepository = diaryRepository;
        this.planRepository = planRepository;
    }
    // 일정 저장
    public boolean writeSave(String userId, LocalDate date, List<Map<String, Object>> plan, String diary) {
        System.out.println("들어옴1");
        try {
            System.out.println("들어옴2");
            Member member = memberRepository.findById(userId).orElseThrow(EntityNotFoundException::new); // 회원 정보가 담긴 객체 가져옴
            System.out.println("들어옴3");
            planRepository.deleteByUserIdAndPlanDate(member, date); // 기존의 plan 삭제. 삭제하지 않으면 DB에 기존의 것이 계속 존재.
            System.out.println("들어옴4");
            diaryRepository.deleteByUserIdAndDiaryDate(member, date); // 기존의 diary 삭제
            System.out.println("들어옴5");

            // plan 저장
            for(Map<String, Object> p : plan) {
                System.out.println("들어옴6");
                System.out.println("deleted : " + p.get("deleted"));
                System.out.println(p.get("deleted").getClass().getName());
                System.out.println("들어옴7");
                // 원래는 p.get("deleted") == false 이면 일정 저장
                if((boolean)p.get("deleted") == false) {
                    System.out.println("들어옴8");
                    Plan plans = new Plan();
                    plans.setUserId(member);
                    plans.setPlanDate(date);
                    if(p.get("checked").equals(true)) plans.setPlanChecked(1);
                    else plans.setPlanChecked(0);
                    plans.setPlan((String)p.get("text"));
                    Plan rst = planRepository.save(plans);
                    log.warn(rst.toString());
                }
            }
            // diary 업데이트
            Diary diaries = new Diary();
            diaries.setDiary(diary);
            diaries.setUserId(member);
            diaries.setDiaryDate(date);
            Diary rst = diaryRepository.save(diaries);
            log.warn(rst.toString());
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    // 일정 불러오기
    public WriteDTO writeLoad(String id, LocalDate date) {
        WriteDTO writeDTO = new WriteDTO();
        try{
            Member member = memberRepository.findById(id).orElseThrow();
            List<Plan> plans = planRepository.findByUserIdAndPlanDateOrderByPlanNoAsc(member, date);
            List<Map<String, Object>> planList = new ArrayList<>();
            for (Plan e : plans) {
                Map<String, Object> plan = new HashMap<>();
                plan.put("key", e.getPlanNo());
                plan.put("checked", e.getPlanChecked());
                plan.put("text", e.getPlan());
                plan.put("deleted", false);
                planList.add(plan);
            }
            writeDTO.setPlanList(planList);
            List<Diary> diaryList = diaryRepository.findByUserIdAndDiaryDate(member, date);
            if(diaryList.size() != 0) {
                String diary = diaryList.get(0).getDiary();
                writeDTO.setDiary(diary);
            } else writeDTO.setDiary("");
            //다이어리 담기
            writeDTO.setOk(true);
        } catch (Exception e) {
            writeDTO.setOk(false);
        }
        return writeDTO;
    }
}
