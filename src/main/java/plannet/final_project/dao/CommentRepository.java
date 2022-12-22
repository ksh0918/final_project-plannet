package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Comment;
import plannet.final_project.entity.Member;

import java.util.List;
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoardNo(Board board);
    void deleteByBoardNo(Board board);
    void deleteById(Long commentNo);
    void deleteByUserId (Member member);
    @Query(value="select * from (select row_number() over(order by write_date desc) as num, comment_no, detail, write_date, board_no, id from comment where board_no=(:boardNo))comment where num > (:offsetNum) and num <=(:limitNum)", nativeQuery = true)
    List<Comment> findComment(@Param("boardNo") Long boardNo, @Param("offsetNum") Long offsetNum, @Param("limitNum") Long limitNum);

    @Query(value = "select board_No from BOARD where write_date in (select MAX(write_date) from BOARD group by id having id = (:userId))", nativeQuery = true)
    Long findLastBoardNo(@Param("userId") String userId);
}
