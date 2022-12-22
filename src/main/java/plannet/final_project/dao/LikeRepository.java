package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.LikeList;
import plannet.final_project.entity.Member;

import java.util.List;

// 엔티티를 만들었으니 DB에 접근할 수 있는 Repository를 만든다
// 요청과 응답만 처리
// JpaRepository<테이블명, 프라이머리키에 대한 데이터 형>
public interface LikeRepository extends JpaRepository<LikeList, Long> {
    Long countByBoardNo(Board boardNo);
    boolean existsByUserIdAndBoardNo(Member userId, Board boardNo);
    @Query(value = "select board_no from like_cnt group by board_no order by count(board_no) desc, board_no desc limit 3", nativeQuery = true)
    List<Integer> findAllTop3GroupByBoardNoOrderByCountByBoardNoDescBoardNoDesc();
    void deleteByUserIdAndBoardNo(Member member, Board boardNo);
    void deleteByUserId(Member member);
    void deleteByBoardNo(Board boardNo);
}
