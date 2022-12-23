package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query(value = "select * from (select row_number() over(order by write_date desc) as num, comment_no, detail, write_date, board_no, id from comment where board_no=(:boardNo))comment where num > (:offsetNum) and num <=(:limitNum)", nativeQuery = true)
    List<Comment> findComment(@Param("boardNo") Long boardNo, @Param("offsetNum") Long offsetNum, @Param("limitNum") Long limitNum);
    void deleteById(Long commentNo);
    void deleteByUserId(Member member);
    void deleteByBoardNo(Board board);
}
