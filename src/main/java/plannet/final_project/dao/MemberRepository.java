package plannet.final_project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import plannet.final_project.entity.Member;

public interface MemberRepository extends JpaRepository<Member, String> {
    Member findByNickname(String nickname);
    Member findByUserCode(String userCode);
    Member findByEmail(String email);
    Member findByTel(String tel);
    Member findByIdAndEmail(String id, String email);
    Member findByNicknameAndUserCode(String nickname, String userCode);
    Member findByNameAndEmail(String name, String email);
}