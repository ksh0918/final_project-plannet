package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@ToString
@Entity
public class Member {
    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 20)
    private String pwd;

    @Column(length = 1) // 소셜로 가입한 사람인지 기록하는 컬럼
    private String social;

    @Column(nullable = false, length = 5)
    private String userCode;

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

    @Column(length = 200)
    private String proImg;

    @Column(length = 300)
    private String profile;

    @Column(length = 2400)
    private String memo;

    @Column(length = 10, nullable = false)
    private String marketingOptIn; // 마케팅 수신 여부 (아무것도 체크하지 않을 때 NON, 이메일만 체크 Email, SMS만 체크 SMS, 모두 체크 ALL)

    @Column(length = 1, nullable = false)
    @ColumnDefault("0")
    private int reRegChecked; // 탈퇴 회원 여부 (재가입 방지)

    @OneToMany(mappedBy = "userId", cascade = {CascadeType.REMOVE}, orphanRemoval=true)
    private List<SCAL> scals;
    @OneToMany(mappedBy = "userId", cascade = {CascadeType.REMOVE}, orphanRemoval=true)
    private List<SMEM> smems;
    @OneToMany(mappedBy = "userId", cascade = {CascadeType.REMOVE}, orphanRemoval=true)
    private List<SPLAN> splans;
    @OneToMany(mappedBy = "userId", cascade = {CascadeType.REMOVE}, orphanRemoval=true)
    private List<SCOM> scoms;
    @OneToMany(mappedBy = "userId", cascade = {CascadeType.REMOVE}, orphanRemoval=true)
    private List<Friend> friends;
    @OneToMany(mappedBy = "friendId", cascade = {CascadeType.REMOVE}, orphanRemoval=true)
    private List<Friend> friendList;
    @OneToMany(mappedBy = "userId", cascade = {CascadeType.REMOVE}, orphanRemoval=true)
    private List<Noti> notis;
    @OneToMany(mappedBy = "receiveId", cascade = {CascadeType.REMOVE}, orphanRemoval=true)
    private List<Noti> notiList;
}