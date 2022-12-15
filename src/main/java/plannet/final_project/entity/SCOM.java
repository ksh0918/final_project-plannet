package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@ToString
@Entity
@Table(name = "s_com")
public class SCOM {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long commentNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cal_no")
    private SCAL calNo;

    @CreatedDate
    private LocalDate planDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Member userId;

    @CreatedDate
    private LocalDateTime writeDate;

    @Column(nullable = false, length = 500)
    private String detail;
}