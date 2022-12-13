package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Noti;

public interface NotiRepository extends JpaRepository<Noti,Long> {
}
