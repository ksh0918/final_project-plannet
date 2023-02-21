package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {
    @Query(value = "select * from message where receive_Id = (:receive_id) order by MESSAGE_NO DESC",nativeQuery = true)
    List<Message> findAllMatchingId(@Param("receive_id") String receive_id);
    void deleteByUserId(Member member);
    void deleteByMessageNo(Long messageNo);
    @Query(value = "select * from (select * from message where DETAIL like (:keyword)) searchTable where receive_id = (:receive_id) order by MESSAGE_NO DESC", nativeQuery = true)
    List<Message> findByDetailLikeOrderByMessageNoDesc(@Param("receive_id") String receive_id, @Param("keyword") String keyword);
}