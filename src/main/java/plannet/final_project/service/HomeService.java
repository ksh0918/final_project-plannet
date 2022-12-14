package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.MemberRepository;
import plannet.final_project.dao.PlanRepository;
import plannet.final_project.dao.QuoteRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Plan;
import plannet.final_project.vo.HomeDTO;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class HomeService {
    private final MemberRepository memberRepository;
    private final QuoteRepository quoteRepository;
    private final PlanRepository planRepository;

    public HomeDTO homeList(String id) {
        HomeDTO homeDTO = new HomeDTO();
        try{
            Member member = memberRepository.findById(id).orElseThrow();
            LocalDate[] weekDay = {
                    LocalDate.now().with(WeekFields.of(Locale.KOREA).dayOfWeek(), 1),
                    LocalDate.now().with(WeekFields.of(Locale.KOREA).dayOfWeek(), 2),
                    LocalDate.now().with(WeekFields.of(Locale.KOREA).dayOfWeek(), 3),
                    LocalDate.now().with(WeekFields.of(Locale.KOREA).dayOfWeek(), 4),
                    LocalDate.now().with(WeekFields.of(Locale.KOREA).dayOfWeek(), 5),
                    LocalDate.now().with(WeekFields.of(Locale.KOREA).dayOfWeek(), 6),
                    LocalDate.now().with(WeekFields.of(Locale.KOREA).dayOfWeek(), 7)
            };
            List<List<Map<String, Object>>> weekPlan = new ArrayList<>();
            for(int i = 0; i < 7; i++) {
                log.warn(String.valueOf(weekDay[i]));
                List<Map<String, Object>> dayPlan = new ArrayList<>();
                List<Plan> dayPlanOrigin = planRepository.findByUserIdAndPlanDateOrderByPlanNoAsc(member, weekDay[i]);
                for(Plan e : dayPlanOrigin) {
                    Map<String, Object> plan = new HashMap<>();
                    plan.put("no", e.getPlanNo());
                    plan.put("plan", e.getPlan());
                    plan.put("checked", e.getPlanChecked());
                    dayPlan.add(plan);
                    log.warn(String.valueOf(plan));
                }
                weekPlan.add(dayPlan);
            }
            homeDTO.setWeekPlan(weekPlan);
            // planMark
            List<Set<LocalDate>> planMark = new ArrayList<>();
            for(int i = 0; i < 2; i++) {
                Set<LocalDate> planDot = new HashSet<>();
                List<Plan> plan = planRepository.findByUserIdAndPlanChecked(member, i);
                for(Plan e : plan) {
                    planDot.add(e.getPlanDate());
                }
                planMark.add(planDot);
            }
            homeDTO.setPlanMark(planMark);
            // memoLoad
            if(member.getMemo() != null) {
                homeDTO.setMemo(member.getMemo());
            } else homeDTO.setMemo("");
            // quoteLoad
            int randomNum = (int) (Math.random() * ((int) quoteRepository.count() + 1));
            homeDTO.setQuote(quoteRepository.findById(randomNum).orElseThrow().getQuote());
            homeDTO.setOk(true);
        } catch (Exception e){
            homeDTO.setOk(false);
        }
        return homeDTO;
    }

    public boolean memoWrite(String id, String detail) {
        try {
            Member member = memberRepository.findById(id).orElseThrow();
            member.setMemo(detail);
            memberRepository.save(member);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }
}
