package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import plannet.final_project.entity.Diary;
import plannet.final_project.entity.Member;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByUserIdAndDiaryDate(Member userID, LocalDate date);
    void deleteByUserId(Member member);
    @Modifying //데이터베이스에 변경을 주는 네이티브 쿼리는 이 어노테이션 필요 (INSERT, UPDATE, DELETE)
    @Transactional
    @Query(value="delete from diary where id = (:userId) and diary_date = (:date)", nativeQuery = true)
    void deleteByUserIdAndDiaryDate(@Param("userId") String userId, @Param("date") LocalDate date);
}
