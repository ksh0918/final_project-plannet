package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Comments;
import plannet.final_project.entity.Member;

import java.util.List;
public interface CommentsRepository extends JpaRepository<Comments, Long> {
    List<Comments> findByBoardNo(Board board);
    void deleteByBoardNo(Board board);
    void deleteById(Long commentNo);
    void deleteByUserId (Member member);
    List<Comments> findByBoardNoOrderByWriteDateDesc(Board board);
}
