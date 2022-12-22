package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SCAL;

public interface SCALRepository extends JpaRepository<SCAL, Long> {
    @Query(value = "select MAX(scal_no) from s_cal where owner_id = (:userId)", nativeQuery = true)
    Long findMaxScalNo(@Param("userId") String userId);
    void deleteByUserId(Member member);
    void deleteByScalNo(Long CalNo);
}