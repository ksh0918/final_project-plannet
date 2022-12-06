package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SMEM;

import java.util.List;

public interface SMEMRepository extends JpaRepository<SMEM, Long> {
    List<SMEM> findByUserId(Member userId);
}
