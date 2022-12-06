package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Message;

public interface MessageRepository extends JpaRepository<Message,Long> {
}
