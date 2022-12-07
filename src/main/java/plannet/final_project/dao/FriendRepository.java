package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Friend;
import plannet.final_project.entity.Member;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    void deleteByUserId(Member member);
}
