package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Plan;

import java.time.LocalDate;
import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByUserId(Member userId);
    List<Plan> findByUserIdAndPlanChecked(Member userId, int planChecked);
    List<Plan> findByUserIdAndPlanDateOrderByPlanNoAsc(Member member, LocalDate localDate);
}
