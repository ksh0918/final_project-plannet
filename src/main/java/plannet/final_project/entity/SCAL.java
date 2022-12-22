package plannet.final_project.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Getter @Setter
@ToString
@Entity
@Table(name = "s_cal")
@SequenceGenerator(
        name = "SCAL_GENERATOR",
        sequenceName = "SCAL_SEQUENCES",
        initialValue = 1, allocationSize = 1)
public class SCAL {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SCAL_GENERATOR")
    private Long scalNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "owner_id")
    private Member userId;

    @Column(length = 40, nullable = false)
    private String scalName;

    @Column(length = 2400)
    private String scalMemo;

    @OneToMany(mappedBy = "calNo", cascade = {CascadeType.ALL}, orphanRemoval=true)
    private List<SPLAN> splans;
    @OneToMany(mappedBy = "calNo", cascade = {CascadeType.ALL}, orphanRemoval=true)
    private List<SMEM> smems;
    @OneToMany(mappedBy = "calNo", cascade = {CascadeType.ALL}, orphanRemoval=true)
    private List<SCOM> scoms;
}