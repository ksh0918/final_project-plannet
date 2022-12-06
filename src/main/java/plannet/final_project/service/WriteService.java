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
        try {
            // 회원 정보가 담긴 객체 가져옴
            Member member = memberRepository.findById(userId).orElseThrow(EmptyStackException::new);

            // plan 저장
            for(Map<String, Object> p : plan) {
                if(p.get("deleted").equals("false")) {
                    Plan plans = new Plan();
                    plans.setUserId(member);
                    plans.setPlanDate(date);
                    plans.setPlanNo(Long.parseLong((String)p.get("key")));
                    if(p.get("checked").equals(true)) plans.setPlanChecked(1);
                    else plans.setPlanChecked(0);
                    plans.setPlan((String)p.get("text"));
                    Plan rst = planRepository.save(plans);
                    log.warn(rst.toString());
                }
            }
            // diary 업데이트
            List<Diary> diaryList = diaryRepository.findByUserIdAndDiaryDate(member, date);
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
