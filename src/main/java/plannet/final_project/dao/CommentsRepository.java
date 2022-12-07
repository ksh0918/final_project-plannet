package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Comments;
import plannet.final_project.entity.Member;

import java.util.List;
public interface CommentsRepository extends JpaRepository<Comments, String> {
    List<Comments> findByBoardNo(Board board);
    List<Comments> findByUserId(String userId);
    void deleteByBoardNo(Board board);
    void deleteByUserId (Member member);
}
