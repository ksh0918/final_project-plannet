package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Getter @Setter
@ToString
@Entity
public class Member {
    @Id
    @Column(length = 15)
    private String id;

    @Column(nullable = false, length = 5)
    private String userCode;

    @Column(nullable = false, length = 20)
    private String pwd;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String nickname;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(unique = true, length = 30)
    private String tel;

    // 자바는 카멜표기법을 따르지만 DB에서는 그렇지 않아서 JOIN_DATE 로 생성됨
    @CreatedDate
    private LocalDateTime joinDate;

    @Column(length = 20)
    private String SNS;

    @Column(length = 300)
    private String profile;

    @Column(length = 2400)
    private String memo;

    @Column(length = 200)
    //@ColumnDefault("userdefault.png")
    private String proImg;
}