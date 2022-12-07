package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Diary;
import plannet.final_project.entity.Member;

import java.time.LocalDate;
import java.util.List;
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByUserIdAndDiaryDate(Member userID, LocalDate date);
    void deleteByUserId(Member member);
    void deleteByUserIdAndDiaryDate(Member userId, LocalDate date);
}
