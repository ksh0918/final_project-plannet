package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class MemberDTO {
    private String id;
    private String userCode;
    private String nickname;
    private String email;
    private String tel;
    private String profile;
    private String proImg;
    private int pes; // 개인 일정의 달성률
    private List<List<Object>> sCalList; // 공유 캘린더의 정보가 넘어옴, 번호, 이름, 달성률
    private boolean isReg; // 아이디 비밀번호 찾을 때 true/false 응답

    private boolean isOk;
}