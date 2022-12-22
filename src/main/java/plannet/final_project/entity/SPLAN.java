package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDate;

@Getter @Setter
@ToString
@Entity
@Table(name = "s_plan")
@SequenceGenerator(
        name = "SPLAN_GENERATOR",
        sequenceName = "SMEM_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class SPLAN {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SPLAN_GENERATOR")
    private Long splanNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cal_no")
    private SCAL scalNo;

    @CreatedDate
    private LocalDate splanDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Member userId;

    @Column(nullable = false, name = "plan_check")
    @ColumnDefault("0")
    private int planChecked;

    @Column(nullable = false, length = 90)
    private String plan;
}