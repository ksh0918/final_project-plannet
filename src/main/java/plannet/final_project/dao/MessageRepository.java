package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {
    @Query(value = "select * from MESSAGE where receive_Id = (:receive_id) order by date desc",nativeQuery = true)
    List<Message> findAllMatchingId(@Param("receive_id") String receive_id);
    void deleteByUserId(Member member);
    void deleteByMessageNo(Long messageNo);
//    @Query(value = "select * from MESSAGE where [detail]like '%(:keyWord)%' or [nickname]like '%(:keyWord)%' or [user_code]like '%(:keyWord)%'",nativeQuery = true)
//    List<Message> findByUserIdLikeOrDetailLikeOrderByMessageNoDesc(@Param("keyWord") String keyWord);

//    @Query(value = "select * from (select * from MESSAGE where DETAIL or receive_ID like '%(:keyword)%') searchTable where receive_id = '(:receive_id)';",nativeQuery = true)
    @Query(value = "select * from message where receive_id =(:receive_id) and detail like '%(:keyword)%';",nativeQuery = true)
    List<Message> findByReceiveIdAndDetailLikeOrderByDateDesc(@Param("receive_id") String receive_id,@Param("keyword") String keyword);

}