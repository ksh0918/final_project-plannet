package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {
    @Query(value = "select * from MESSAGE where receive_Id = (:receive_id) order by date desc",nativeQuery = true)
    List<Message> findAllMatchingId(@Param("receive_id") String receive_id);
    void deleteByUserId(Member member);
    void deleteByMessageNo(Long messageNo);
}