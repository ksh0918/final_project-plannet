package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Member;

import java.util.List;

// 엔티티를 만들었으니 DB에 접근할 수 있는 Repository를 만든다
// 요청과 응답만 처리
// JpaRepository<테이블명, 프라이머리키에 대한 데이터 형>
public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findAllByOrderByBoardNoDesc();
    List<Board> findByTitleLikeOrDetailLikeOrderByBoardNoDesc(String keyword1, String keyword2);
    @Query(value = "select * from BOARD where board_No in (:board_no) order by board_no desc", nativeQuery = true)
    List<Board> findAllMatchingBoardNo(@Param("board_no") List<Integer> board_no);
    @Query(value = "select board_No from BOARD where write_date in (select MAX(write_date) from BOARD group by id having id = (:userId))", nativeQuery = true)
    Long findLastBoardNo(@Param("userId") String userId);
    void deleteByUserId(Member member);
}

