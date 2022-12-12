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
        try {
            Member member = memberRepository.findById(userId).orElseThrow(EntityNotFoundException::new); // 회원 정보가 담긴 객체 가져옴
            planRepository.deleteByUserIdAndPlanDate(userId, date); // 기존의 일정 삭제. 삭제 안 하면 기존의 것들이 DB에 계속 있음
            diaryRepository.deleteByUserIdAndDiaryDate(userId, date); // 기존의 다이어리 삭제

            // plan 저장
            for(Map<String, Object> p : plan) {
                if(!(Boolean)p.get("deleted")) { // p.get("deleted") == false 이면 일정 저장
                    Plan plans = new Plan();
                    plans.setUserId(member);
                    plans.setPlanDate(date);
                    String checked = String.valueOf(p.get("checked"));
                    if(checked.equals("0")) { // 수정하지 않은 기본의 것들은 checked가 1 또는 0으로 로드되기 때문에 따로 확인해줘야 함
                        plans.setPlanChecked(0);
                    } else if (checked.equals("1")) {
                        plans.setPlanChecked(1);
                    } else if (checked.equals("false")) { // 새로 생성하거나 수정한 checked는 true/false로 request함
                        plans.setPlanChecked(0);
                    } else if (checked.equals("true")) {
                        plans.setPlanChecked(1);
                    }
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
            e.printStackTrace();
            return false;
        }
        return true;
    }
}