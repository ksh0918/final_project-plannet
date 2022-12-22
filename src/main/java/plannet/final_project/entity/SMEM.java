package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;

@Getter @Setter
@ToString
@Entity
@Table(name = "s_mem")
@SequenceGenerator(
        name = "SMEM_GENERATOR",
        sequenceName = "SMEM_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class SMEM {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SMEM_GENERATOR")
    private Long smemNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cal_no")
    private SCAL scalNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Member userId; // 참가자 아이디

    @Column(name = "isOwner", nullable = false)
    @ColumnDefault("0")
    private int isOwner;
}