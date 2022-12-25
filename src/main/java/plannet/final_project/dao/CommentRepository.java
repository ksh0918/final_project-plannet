package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoardNoOrderByWriteDateDesc(Board boardNo);
    void deleteById(Long commentNo);
    void deleteByUserId(Member member);
    void deleteByBoardNo(Board board);
}
