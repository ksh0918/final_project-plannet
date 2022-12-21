package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SCAL;
import plannet.final_project.entity.SMEM;

import java.util.List;

public interface SMEMRepository extends JpaRepository<SMEM, Long> {
    List<SMEM> findByUserId(Member userId);
    void deleteByUserId(Member member);
    List<SMEM> findByCalNo(SCAL calNo);
    SMEM findByCalNoAndUserId(SCAL scal, Member dropId);
    void deleteByCalNo(SCAL CalNo);
}
