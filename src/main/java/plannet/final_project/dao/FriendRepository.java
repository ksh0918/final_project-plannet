package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Friend;

public interface FriendRepository extends JpaRepository<Friend, Long> {
}
