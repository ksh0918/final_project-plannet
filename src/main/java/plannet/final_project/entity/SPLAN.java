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
public class SPLAN {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long splanNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cal_no")
    private SCAL calNo;

    @CreatedDate
    private LocalDate planDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Member userId;

    @Column(nullable = false, name = "plan_check")
    @ColumnDefault("0")
    private int planChecked;

    @Column(nullable = false, length = 90)
    private String plan;
}