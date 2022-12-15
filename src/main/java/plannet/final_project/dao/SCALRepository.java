package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SCAL;

public interface SCALRepository extends JpaRepository<SCAL, Long> {
    void deleteByUserId(Member member);
}