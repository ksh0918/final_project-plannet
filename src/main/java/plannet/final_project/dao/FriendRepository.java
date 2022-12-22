package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Friend;
import plannet.final_project.entity.Member;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByUserId(Member member);
    Friend findByUserIdAndFriendId(Member send, Member recive);
    void deleteByUserId(Member member);
}