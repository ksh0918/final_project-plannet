package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Board;
import plannet.final_project.entity.Member;

import java.util.List;
public interface MemberRepository extends JpaRepository<Member, String> {
    Member findByEmail(String email);
    Member findByTel(String tel);
    Member findByNameAndEmail(String name, String email);
    Member findByIdAndEmail(String id, String email);
    Member findByNickname(String nickname);
    Member findByNicknameAndUserCode(String nickname, String userCode);
    Member findByUserCode(String userCode);

}
