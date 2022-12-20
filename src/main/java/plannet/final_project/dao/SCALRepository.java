package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SCAL;

public interface SCALRepository extends JpaRepository<SCAL, Long> {
    void deleteByUserId(Member member);
    @Query(value = "select cal_no from s_cal where write_date in (select MAX(write_date) from BOARD group by id having id = (:userId))", nativeQuery = true)
    Long findLastCalNo(@Param("userId") String userId);
    @Query(value = "select MAX(cal_no) from s_cal where id = (:userId)", nativeQuery = true)
    Long findMaxCalNo(@Param("userId") String userId);

}