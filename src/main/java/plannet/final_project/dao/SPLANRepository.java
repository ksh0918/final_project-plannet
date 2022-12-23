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
    List<SPLAN> findByScalNoAndSplanDateOrderBySplanNoAsc(SCAL calNo, LocalDate localDate);
    List<SPLAN> findByScalNoAndSplanChecked(SCAL calNo, int planChecked);
    void deleteByUserId(Member member);
    void deleteByScalNo(SCAL CalNo);
    @Modifying //데이터베이스에 변경을 주는 네이티브 쿼리는 이 어노테이션 필요 (INSERT, UPDATE, DELETE)
    @Transactional
    @Query(value="delete from s_plan where cal_no = (:calNo) and plan_date = (:date)", nativeQuery = true)
    void deleteByPlanDateAndScalNo(@Param("date") LocalDate date, @Param("calNo") Long calNo);
}