package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Comment;
import plannet.final_project.entity.Member;

import java.util.List;
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoardNo(Board board);
    void deleteByBoardNo(Board board);
    void deleteById(Long commentNo);
    void deleteByUserId (Member member);
    List<Comment> findByBoardNoOrderByWriteDateDesc(Board board);
}
