package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter @Setter
@ToString
@Entity
@SequenceGenerator(
        name = "NOTI_GENERATOR",
        sequenceName = "NOTI_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class Noti {
    @Id
    // 키 값을 생성하는 전략 : 기본키 생성을 JPA 기준
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "NOTI_GENERATOR")
    private Long notiNo;

    // 보내는 이
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "send_id")
    private Member userId;

    // 받는 이
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receive_id")
    private Member receiveId;

    // 초대 타입 (friend or scal)
    @Column(nullable = false)
    private String type;

    // 초대 타입이 scal인 경우 calNo, 친구인 경우 NULL
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etc")
    private SCAL calNo;

    // 초대 날짜
    @CreatedDate
    private LocalDateTime inviteDate;

    // 현재 상태 (수락 여부, 0이면 미수락, 1이면 수락)
    @Column(name = "ischecked")
    @ColumnDefault("0")
    private int acceptChecked;
}