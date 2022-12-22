package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;
import plannet.final_project.entity.Noti;
import plannet.final_project.entity.SCAL;

import java.util.List;

public interface NotiRepository extends JpaRepository<Noti,Long> {
    List<Noti> findByReceiveIdAndAcceptChecked(Member member, int isChecked);
    Noti findByReceiveIdAndAcceptCheckedAndScalNo(Member userId, int i, SCAL scal);

    List<Noti> findByUserIdAndReceiveIdAndTypeAndAcceptChecked(Member send, Member recive, String f, int i);
    void deleteByScalNo(SCAL calNo);
}
