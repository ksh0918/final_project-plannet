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
@SequenceGenerator(
        name = "SCOM_GENERATOR",
        sequenceName = "SCOM_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class SCOM {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SCOM_GENERATOR")
    private Long commentNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scal_no")
    private SCAL scalNo;

    @CreatedDate
    private LocalDate splanDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", nullable = false)
    private Member userId;

    @CreatedDate
    private LocalDateTime writeDate;

    @Column(nullable = false, length = 500)
    private String detail;
}