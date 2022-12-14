package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SCAL;
import plannet.final_project.entity.SPLAN;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

public interface SPLANRepository extends JpaRepository<SPLAN, Long> {
    List<SPLAN> findByScalNo(SCAL scal);
    List<SPLAN> findByScalNoAndSplanDateOrderBySplanNoAsc(SCAL scalNo, LocalDate localDate);
    List<SPLAN> findByScalNoAndSplanChecked(SCAL scalNo, int planChecked);
    Long countByScalNo(SCAL scalNo);
    Long countByScalNoAndSplanChecked(SCAL scalNo, int checked);
    void deleteByUserId(Member member);
    void deleteByScalNo(SCAL scalNo);
    @Modifying //데이터베이스에 변경을 주는 네이티브 쿼리는 이 어노테이션 필요 (INSERT, UPDATE, DELETE)
    @Transactional
    @Query(value="delete from s_plan where scal_no = (:scalNo) and splan_date = (:date)", nativeQuery = true)
    void deleteBySPlanDateAndScalNo(@Param("date") LocalDate date, @Param("scalNo") Long calNo);
}