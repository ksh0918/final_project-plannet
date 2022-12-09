package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
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
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class WriteService {
    private final MemberRepository memberRepository;
    private final DiaryRepository diaryRepository;
    private final PlanRepository planRepository;

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

    // 일정 저장
    public boolean writeSave(String userId, LocalDate date, List<Map<String, Object>> plan, String diary) {
        System.out.println("들어옴1");
        try {
            System.out.println("들어옴2");
            System.out.println("useId : " + userId);
            System.out.println("date : " + date);
            Member member = memberRepository.findById(userId).orElseThrow(EntityNotFoundException::new); // 회원 정보가 담긴 객체 가져옴
            System.out.println("들어옴3");
            planRepository.deleteByUserIdAndPlanDate(userId, date);
            System.out.println("들어옴4");
            diaryRepository.deleteByUserIdAndDiaryDate(userId, date);
//            diaryRepository.deleteByUserId(member); // 기존의 diary 삭제
            System.out.println("들어옴5");

            log.error("Plan Size : " + plan.size());
            System.out.println("Plan Size : " + plan.size());

            // plan 저장
            for(Map<String, Object> p : plan) {
                System.out.println("들어옴6");
                System.out.println("deleted : " + p.get("deleted"));
                System.out.println(p.get("deleted").getClass().getName());
                System.out.println("들어옴7");
                // 원래는 p.get("deleted") == false 이면 일정 저장
                if(!(Boolean)p.get("deleted")) {
                    System.out.println("들어옴8");
                    Plan plans = new Plan();
                    System.out.println("들어옴9");
                    plans.setUserId(member);
                    System.out.println("들어옴10");
                    plans.setPlanDate(date);
                    System.out.println("들어옴11");
                    System.out.println("checked : " + p.get("checked"));
                    System.out.println(p.get("checked").getClass().getName());
                    String checked = String.valueOf(p.get("checked"));
                    if(checked.equals("0")) {
                        System.out.println("체크 인터저1");
                        plans.setPlanChecked(0);
                        System.out.println("체크 인티저2");
                    } else if (checked.equals("1")) {
                        System.out.println("체크 인터저1");
                        plans.setPlanChecked(1);
                        System.out.println("체크 인티저2");
                    } else if (checked.equals("false")) {
                        System.out.println("들어옴12");
                        plans.setPlanChecked(0);
                        System.out.println("들어옴13");
                    } else if (checked.equals("true")) {
                        System.out.println("들어옴14");
                        plans.setPlanChecked(1);
                        System.out.println("들어옴15");
                    }

                    System.out.println("들어옴16");
                    plans.setPlan((String)p.get("text"));
                    System.out.println("들어옴17");
                    Plan rst = planRepository.save(plans);
                    System.out.println("들어옴18");
                    log.warn(rst.toString());
                    System.out.println("들어옴19");
                }
            }
            // diary 업데이트
            System.out.println("들어옴20");
            Diary diaries = new Diary();
            System.out.println("들어옴21");
            diaries.setDiary(diary);
            System.out.println("들어옴22");
            diaries.setUserId(member);
            System.out.println("들어옴23");
            diaries.setDiaryDate(date);
            System.out.println("들어옴24");
            Diary rst = diaryRepository.save(diaries);
            System.out.println("들어옴25");
            log.warn(rst.toString());
            System.out.println("들어옴26");
        } catch (Exception e) {
            e.printStackTrace();

        }
        return true;
    }
}