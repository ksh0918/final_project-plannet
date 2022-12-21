package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SCAL;
import plannet.final_project.entity.SCOM;

import java.time.LocalDate;
import java.util.List;

public interface SCOMRepository extends JpaRepository<SCOM, Long> {
    void deleteByUserId(Member member);
    List<SCOM> findByCalNoAndPlanDate(SCAL calNo, LocalDate planDate);
    void deleteByCalNo(SCAL CalNo);
}
