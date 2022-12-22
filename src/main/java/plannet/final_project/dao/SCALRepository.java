package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SCAL;

public interface SCALRepository extends JpaRepository<SCAL, Long> {
    void deleteByUserId(Member member);
    @Query(value = "select scal_no from s_cal where write_date in (select MAX(write_date) from BOARD group by id having id = (:userId))", nativeQuery = true)
    Long findLastScalNo(@Param("userId") String userId);
    @Query(value = "select MAX(scal_no) from s_cal where owner_id = (:userId)", nativeQuery = true)
    Long findMaxScalNo(@Param("userId") String userId);
    void deleteByScalNo(Long CalNo);

}