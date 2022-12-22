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
@Table(name = "message")
@SequenceGenerator(
        name = "MESSAGE_GENERATOR",
        sequenceName = "MESSAGE_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class Message {
    @Id
    @Column(name = "message_no")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MESSAGE_GENERATOR")
    private Long messageNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Member userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receive_id")
    private Member receiveId;

    @CreatedDate
    private LocalDateTime date;

    @Column(length = 2400, nullable = false)
    private String detail;

    @Column(length = 1, name = "isRead", nullable = false)
    @ColumnDefault("0")
    private int isRead;
}