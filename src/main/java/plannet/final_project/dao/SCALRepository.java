package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SCAL;

import java.util.List;

public interface SCALRepository extends JpaRepository<SCAL, Long> {
    List<SCAL> findByUserId(Member member);
}
