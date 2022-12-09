package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Plan;

import java.time.LocalDate;
import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByUserId(Member userId);
    List<Plan> findByUserIdAndPlanChecked(Member userId, int planChecked);
    List<Plan> findByUserIdAndPlanDateOrderByPlanNoAsc(Member member, LocalDate localDate);
    void deleteByUserId(Member member);
    @Modifying //데이터베이스에 변경을 주는 네이티브 쿼리는 이 어노테이션 필요 (INSERT, UPDATE, DELETE)
    @Query(value="delete from plan where id=:userId and plan_date=:date",
            nativeQuery = true)
    void deleteByUserIdAndPlanDate(String userId, LocalDate date);

}
