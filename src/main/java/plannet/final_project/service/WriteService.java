package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.MemberRepository;
import plannet.final_project.dao.PlanRepository;
import plannet.final_project.dao.DiaryRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Plan;
import plannet.final_project.entity.Diary;
import plannet.final_project.vo.WriteDTO;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class WriteService {
    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;
    private final DiaryRepository diaryRepository;

    // 일정 불러오기
    public WriteDTO writeLoad(String id, LocalDate date) {
        WriteDTO writeDTO = new WriteDTO();
        try{
            Member member = memberRepository.findById(id).orElseThrow();

            List<Plan> planData = planRepository.findByUserIdAndPlanDateOrderByPlanNoAsc(member, date);
            List<Map<String, Object>> planList = new ArrayList<>();
            for(Plan e : planData) {
                Map<String, Object> plan = new HashMap<>();
                plan.put("key", e.getPlanNo());
                plan.put("checked", e.getPlanChecked());
                plan.put("text", e.getPlan());
                plan.put("deleted", false);
                planList.add(plan);
            }
            writeDTO.setPlanList(planList);

            List<Diary> diaryList = diaryRepository.findByUserIdAndDiaryDate(member, date);
            if (diaryList.size() != 0) {
                String diary = diaryList.get(0).getDiary();
                writeDTO.setDiary(diary);
            } else writeDTO.setDiary("");
            writeDTO.setOk(true);
        } catch (Exception e) {
            writeDTO.setOk(false);
        }
        return writeDTO;
    }

    // 일정 저장
    public boolean writeSave(String id, LocalDate date, List<Map<String, Object>> plan, String diary) {
        try {
            Member member = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new); // 회원 정보가 담긴 객체 가져옴
            planRepository.deleteByUserIdAndPlanDate(id, date); // 기존의 일정 삭제. 삭제 안 하면 기존의 것들이 DB에 계속 있음
            diaryRepository.deleteByUserIdAndDiaryDate(id, date); // 기존의 다이어리 삭제

            // plan 저장
            for(Map<String, Object> p : plan) {
                if(!(Boolean)p.get("deleted")) { // p.get("deleted") == false 이면 일정 저장
                    Plan planData = new Plan();
                    planData.setUserId(member);
                    planData.setPlanDate(date);
                    String checked = String.valueOf(p.get("checked"));
                    // 수정하지 않은 기본의 것들은 checked가 1 또는 0으로 로드되기 때문에 따로 확인해줘야 함
                    if(checked.equals("0")) planData.setPlanChecked(0);
                    else if (checked.equals("1")) planData.setPlanChecked(1);
                        // 새로 생성하거나 수정한 checked는 true/false로 request함
                    else if (checked.equals("false")) planData.setPlanChecked(0);
                    else if (checked.equals("true")) planData.setPlanChecked(1);
                    planData.setPlan((String)p.get("text"));
                    planRepository.save(planData);
                }
            }

            // diary 업데이트
            Diary diaryData = new Diary();
            diaryData.setDiary(diary);
            diaryData.setUserId(member);
            diaryData.setDiaryDate(date);
            diaryRepository.save(diaryData);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}