package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.SCOM;

public interface SCOMRepository extends JpaRepository<SCOM, Long> {
    void deleteByUserId(Member member);
}
