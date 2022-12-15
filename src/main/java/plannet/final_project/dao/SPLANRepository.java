package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Plan;
import plannet.final_project.entity.SCAL;
import plannet.final_project.entity.SPLAN;

import java.time.LocalDate;
import java.util.List;

public interface SPLANRepository extends JpaRepository<SPLAN, Long> {
    List<SPLAN> findByCalNo(SCAL scal);
    List<SPLAN> findByCalNoAndPlanChecked(SCAL scal, int planChecked);
    void deleteByUserId(Member member);
//    List<Plan> findByCalNoAndPlanDateOrderBySplanNoAsc(Long calNo, LocalDate localDate);
//    List<Plan> findByCalNoAndPlanChecked(Long calNo, int planChecked);
}
