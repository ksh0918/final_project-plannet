package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.LikeCnt;
import plannet.final_project.entity.Member;

// 엔티티를 만들었으니 DB에 접근할 수 있는 Repository를 만든다
// 요청과 응답만 처리
// JpaRepository<테이블명, 프라이머리키에 대한 데이터 형>
public interface LikeCntRepository extends JpaRepository<LikeCnt, Long> {
    Long countByBoardNo(Board boardNo);
    boolean existsByUserIdAndBoardNo(Member userId, Board boardNo);
    void deleteByUserIdAndBoardNo(Member member, Board boardNo);
}
